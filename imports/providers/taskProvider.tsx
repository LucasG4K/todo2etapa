import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTracker, useSubscribe } from 'meteor/react-meteor-data';
import { TasksCollection } from '/imports/api/Tasks/TasksCollection';
import { useUser } from './userProvider';
import { TaskModel, TaskStatusModel } from '../api/Tasks/TaskModel';
import { Meteor } from 'meteor/meteor';

interface TaskContextType {
    tasks: TaskModel[];
    isLoading: boolean;
    page: number;
    totalPages: number;
    setPage: (page: number) => void;
    handleSave: (editing: boolean, id: string, taskForm: TaskModel) => void;
    handleChangeStatus: (_id: string, newStatus: TaskStatusModel) => void;
    handleDeleteTask: (_id: string) => void;
    countTasks: {
        registered: number;
        inProgress: number;
        completed: number;
    }
}


const TaskContext = createContext<TaskContextType | undefined>(undefined);

const useTasks = () => {
    const context = useContext(TaskContext);
    if (!context) {
        throw new Error('useTasks deve ser usado dentro de um TaskProvider');
    }
    return context;
};


const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useUser();
    const [page, setPage] = useState(1);
    const limit = 4;
    const skip = (page - 1) * limit;
    
    const handleSave = (editing: boolean, id: string, taskForm: TaskModel): Promise<void> => {
        return new Promise((resolve, reject) => {
            if (editing) {
                Meteor.call('task.edit', id, taskForm, (error: Meteor.Error) => {
                    if (error) {
                        reject(new Error('Erro ao atualizar: ' + error.message));
                    } else {
                        resolve();
                    }
                });
            } else {
                Meteor.call('task.insert', taskForm, (error: Meteor.Error) => {
                    if (error) {
                        reject(new Error('Erro ao criar: ' + error.message));
                    } else {
                        resolve();
                    }
                });
            }
        });
    };

    const handleChangeStatus = (_id: string, newStatus: TaskStatusModel) => {
        Meteor.call('task.status', { _id, taskStatus: newStatus }, (error: Meteor.Error) => {
            if (error) {
                alert("Erro ao atualizar a tarefa: " + error.reason);
            }
        });
    };

    const handleDeleteTask = (_id: string) => {
        Meteor.call('task.delete', { _id }, (error: Meteor.Error) => {
            if (error) {
                alert("Erro ao atualizar ao remover tarefa: " + error.reason);
            }
        });
    };

    const isLoading = useSubscribe('tasks', { limit, skip })();

    const { tasks, totalCount, countTasks } = useTracker(() => {
        console.log('tracker do TASKS');
        const fetchedTasks = TasksCollection.find(
            { $or: [{ private: false }, { userId: user?._id }] },
            { sort: { createdAt: -1 }, limit, skip }
        ).fetch();

        const total = TasksCollection.find(
            { $or: [{ private: false }, { userId: user?._id }] }
        ).count();

        const countTasks = {
            registered: TasksCollection.find(
                {
                    $or: [{ private: false}, {userId: user?._id }],
                    status: TaskStatusModel.REGISTERED,
                }
            ).count(),
            inProgress: TasksCollection.find(
                {
                    $or: [{ private: false}, {userId: user?._id }],
                    status: TaskStatusModel.IN_PROGRESS,
                }
            ).count(),
            completed: TasksCollection.find(
                {
                    $or: [{ private: false}, {userId: user?._id }],
                    status: TaskStatusModel.COMPLETED,
                }
            ).count(),
        };

        return {
            tasks: fetchedTasks.map(task => ({
                ...task,
                userName: Meteor.users.findOne(task.userId)?.username || 'Desconhecido',
            })),
            totalCount: total,
            countTasks: countTasks,
        };
    }, [isLoading, page]);

    const totalPages = Math.ceil(totalCount / limit);

    useEffect(() => {
        if (page > totalPages && totalPages > 0) {
            setPage(totalPages);
        }
    }, [totalPages]);

    return (
        <TaskContext.Provider value={{ tasks, isLoading, page, totalPages, countTasks, setPage, handleSave, handleChangeStatus, handleDeleteTask }}>
            {children}
        </TaskContext.Provider>
    );
};


export { TaskProvider, useTasks };