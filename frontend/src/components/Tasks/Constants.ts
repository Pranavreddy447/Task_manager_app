export const TASK_STATUS_CONST = {
    TODO: 0,
    IN_PROGRESS: 1,
    REVIEW: 2,
    DONE: 3
}

export const TASK_LABELS = {
    [TASK_STATUS_CONST.TODO]: {label: 'Todo', color: 'bg-gray-400'},
    [TASK_STATUS_CONST.IN_PROGRESS]: {label: 'In Progress', color: 'bg-blue-300'},
    [TASK_STATUS_CONST.REVIEW]: {label: 'Review', color: 'bg-yellow-300'},
    [TASK_STATUS_CONST.DONE]: {label: 'Done', color: 'bg-green-300'},
}