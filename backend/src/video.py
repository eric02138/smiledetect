import cv2
import sys

source = cv2.VideoCapture(0)

#source = cv2.VideoCapture('rtsp://172.30.224.1/1')

# win_name = 'Camera Preview'
# cv2.namedWindow(win_name, cv2.WINDOW_NORMAL)

# while cv2.waitKey(1) != 27:  # Escape
#     has_frame, frame = source.read()
#     if not has_frame:
#         break
#     cv2.imshow(win_name, frame)

source.release()
# cv2.destroyWindow(win_name)