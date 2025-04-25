package com.springboot.MyTodoList.controller;

import com.springboot.MyTodoList.model.ToDoItem;
import com.springboot.MyTodoList.service.TaskRecommendationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/recommendation")
@CrossOrigin(origins = "*")
public class TaskRecommendationController {

    @Autowired
    private TaskRecommendationService recommendationService;

    @GetMapping
    public ToDoItem recommendTask() {
        return recommendationService.recommendTask();
    }
}
