import os

directory = "./save_folder"
text_name = "feature.json"
image_name = "image.jpg"
log_name = "log.json"


def get_log_path():
    return os.path.join(directory, log_name)


def get_feature_path():
    return os.path.join(directory, text_name)


def get_image_path():
    return os.path.join(directory, image_name)


def get_directory_path():
    return directory
