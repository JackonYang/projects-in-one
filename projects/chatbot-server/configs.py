import os

project_root = os.path.dirname(
    os.path.abspath(__file__)
)

resourses_dir = os.path.join(project_root, 'resourses')

daily_data_root = os.path.join(resourses_dir, 'chat-data-example/daily-data')

demo_chat_uid = os.environ.get('DEMO_CHAT_UID', '')
demo_owner_uid = os.environ.get('DEMO_OWNER_UID', '')
