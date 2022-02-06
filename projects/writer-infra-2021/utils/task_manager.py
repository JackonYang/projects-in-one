import copy


global_vars = {
    'notification-persist': [],
    'notification': '',
    'task_id': 0,
    'task_tmpl_id': 0,
}


def gen_task_id():
    global_vars['task_id'] += 1
    return global_vars['task_id']


class TaskManager():
    task_history = []  # id, only
    task_info = {}
    task_logs = {}  # task_id: log_list
    has_new_logs_map = {}  # task_id: true/false

    def add_new_task(self, **kwargs):
        task_id = gen_task_id()
        self.task_history.append(task_id)
        info = copy.deepcopy(kwargs)
        info['is_done'] = False
        self.task_info[task_id] = info
        return task_id

    def get_task_meta(self, task_id):
        if task_id not in self.task_info:
            return {}

        return self.task_info[task_id]

    def add_task_log(self, task_id, msg):
        self.task_logs.setdefault(task_id, [])
        self.task_logs[task_id].append(msg)
        self.has_new_logs_map[task_id] = True

    def has_new_logs(self, task_id):
        return self.has_new_logs_map.get(task_id, False)

    def get_task_logs(self, task_id):
        self.has_new_logs_map[task_id] = False
        return self.task_logs.get(task_id, [])

    def mark_done(self, task_id, res):
        self.task_info[task_id]['is_done'] = True
        self.task_info[task_id]['result'] = res

    def is_done(self, task_id):
        if task_id not in self.task_info:
            return True

        return self.task_info[task_id]['is_done']
