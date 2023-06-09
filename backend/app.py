import tkinter as tk
from typing import Any

import json
import cv2
import boto3
import io
from PIL import Image


def update_capture_info(recognized_faces_list):
    capture_info.set("Capture Info:\n")
    if recognized_faces_list:
        for face in recognized_faces_list:
            capture_info.set(
                capture_info.get()
                + f"File: {face['File']}\nPosition: {face['Position']}\nSimilarity: {face['Similarity']}%\n"
            )
    else:
        capture_info.set(capture_info.get() + "No faces recognized\n")


def save_recognized_faces(recognized_faces):
    with open('recognized_faces.json', 'w') as file:
        json.dump(recognized_faces, file)


def load_recognized_faces():
    try:
        with open('recognized_faces.json', 'r') as file:
            return json.load(file)
    except FileNotFoundError:
        return []


def close_camera(cap: cv2.VideoCapture):
    if cap is not None:
        cap.release()
    cv2.destroyAllWindows()


def scan():
    recognized_faces_list = load_recognized_faces()
    present = 0
    rekognition = boto3.client('rekognition', region_name="ap-northeast-2")
    bucket = "facerecsejong"
    # Load the cascades
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

    def convertByteStream(faces, counter):
        # Iterate over detected faces
        for (x, y, w, h) in faces:
            # Crop the face from the image
            face_img = img[y:y + h, x:x + w].copy()

            # Convert to RGB (OpenCV uses BGR)
            face_img = cv2.cvtColor(face_img, cv2.COLOR_BGR2RGB)
            print(counter)

            # Convert the image to bytes
            pil_img = Image.fromarray(face_img)
            stream = io.BytesIO()
            pil_img.save(stream, format="JPEG")
            image_binary = stream.getvalue()

            s3 = boto3.client('s3')
            response = s3.list_objects(Bucket=bucket)

            # iterate over each object
            print("Starting iterating")
            for object in response['Contents']:
                target_image = object['Key']

                # use Rekognition to compare the source image to the target image
                print("Sending request")
                rekognition_response = rekognition.compare_faces(
                    SourceImage={
                        'Bytes': image_binary,
                    },
                    TargetImage={
                        'S3Object': {
                            'Bucket': bucket,
                            'Name': target_image,
                        },
                    },
                )
                print("Sent")
                # print the results
                print(rekognition_response)
                for faceMatch in rekognition_response['FaceMatches']:
                    position = faceMatch['Face']['BoundingBox']
                    similarity = faceMatch['Similarity']
                    file_name = target_image.split('/')[-1]
                    capture_info.set(
                        f"Capture Info:\nFile: {file_name}\nPosition: {position}\nSimilarity: {similarity}%")
                    close_camera(cap)  # Close the camera gracefully
                    recognized_faces_list.extend(recognized_faces)
                    save_recognized_faces(recognized_faces_list)
                    return True  # Face recognized, exit the loop

            return False  # Face not recognized, continue the loop

    # Open the video stream
    cap = cv2.VideoCapture(0)

    counter = 0
    is_captured = False
    face_recognized = False  # Flag to track face recognition
    while True:
        # Read the frame
        _, img = cap.read()

        # Convert to grayscale
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        # Detect the faces
        faces = face_cascade.detectMultiScale(gray, 1.1, 4)

        # Draw the rectangle around each face
        for (x, y, w, h) in faces:
            cv2.rectangle(img, (x, y), (x + w, y + h), (255, 0, 0), 2)

            present += 1
            if present >= 12 and (not is_captured):
                is_captured = True
                if convertByteStream(faces, counter):
                    face_recognized = True  # Set the flag to indicate face recognition

        if len(faces) == 0:
            present = 0
            is_captured = False

        # Display
        cv2.imshow('img', img)

        # Stop if escape key is pressed
        k = cv2.waitKey(1) & 0xff
        if k == 27 or face_recognized:
            close_camera(cap)  # Close the camera gracefully
            break


root = tk.Tk()
root = tk.Tk()
root.geometry("400x200")
root.title("Face Recognition")

capture_info = tk.StringVar()
capture_info.set("Capture Info: -")

label = tk.Label(root, textvariable=capture_info, font=("Arial", 12), pady=10, justify="left")
label.pack()

button = tk.Button(root, text="Scan", font=("Arial", 12), width=10, command=scan)
button.pack()

recognized_faces_list = load_recognized_faces()
update_capture_info(recognized_faces_list)  # Initial update of the capture info

root.mainloop()
