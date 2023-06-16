# FaceTrack

This project allows you to track the attendance of students by uploading their images to AWS S3. Theres a desktop app that scans faces and compares them to the saved pictures in the bucket using AWS Rekognition.

## Requirements

- boto3
- opencv-python
- numpy
- Pillow

## AWS Credentials

In order to run this project you need to confugure AWS Credentials with the necessary access rights.
If runnung this in your own account replace the bucket name in app.py with your bucket name.

## Run Backend

- cd backend
- python app.py
- (make sure requirements are installed)
