import React from "react";
import { Box, Button, CircularProgress } from "@mui/material"
import { MyAppBar } from "../../component/myAppBar";
import { User } from "../../../api/User/UserTypes";
import { TodoTable } from "./components/todoTable";
import { TaskModel } from "/imports/api/Tasks/TaskTypes";
import { AddCircleOutlineOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

interface ITodoList {
    user: User,
    tasks: TaskModel[],
    isLoading: boolean,
}

const TodoList: React.FC<ITodoList> = ({ user, tasks, isLoading }) => {

    const navigate = useNavigate();

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <MyAppBar user={user} title='TAREFAS' />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', m: 2 }}>
                <Button
                    startIcon={<AddCircleOutlineOutlined />}
                    sx={{ color: 'black' }}
                    onClick={() => navigate('/todo-list/new-task')}
                >
                    Nova Tarefa
                </Button>
            </Box>
            <TodoTable actionsOn={true} userId={user._id} tasks={tasks} />
        </Box>
    )
}

export { TodoList }