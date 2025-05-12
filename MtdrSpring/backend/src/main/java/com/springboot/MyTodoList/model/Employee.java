package com.springboot.MyTodoList.model;

import javax.persistence.*;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.sql.Timestamp;
import com.fasterxml.jackson.annotation.JsonManagedReference;


@Entity
@Table(name = "EMPLOYEES")
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "EMPLOYEE_ID")
    private int id;

    @Column(name = "USER_ID")
    private int userId;

    @Column(name = "TEAM_ID")
    private int teamId;

    @Column(name = "ROLE")
    private String role;

    @Column(name = "CREATED_AT")
    private Timestamp createdAt;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "USER_ID", insertable = false, updatable = false)
    @JsonManagedReference  // Add this annotation
    private User user;

    @OneToMany(mappedBy = "responsible")
    private List<ToDoItem> tasks;

    @Transient
    public List<ToDoItem> getTasksCompleted() {
        if (tasks == null) return new ArrayList<>();
        return tasks.stream()
            .filter(task -> task.isDone())
            .collect(Collectors.toList());
    }

    @Transient
    public List<ToDoItem> getUncompletedTasks() {
        if (tasks == null) return new ArrayList<>();
        return tasks.stream()
            .filter(task -> !task.isDone())
            .collect(Collectors.toList());
    }

    @Transient
    public Integer getTotalNumberTasks(){
        if (tasks == null) return 0;
        return tasks.size();
    }

    @Transient
    public Integer getNumberTasksCompleted() {
        return getTasksCompleted().size();
    }
    
    @Transient
    public Double getNumberHoursWorked() {
        return getTasksCompleted().stream()
            .mapToDouble(task -> task.getActualTime() != null ? task.getActualTime() : 0.0)
            .sum();
    }
    
    // Default constructor and other constructors

    // Getter and Setter methods
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public int getUserId() { return userId; }
    public void setUserId(int userId) { this.userId = userId; }

    public int getTeamId() { return teamId; }
    public void setTeamId(int teamId) { this.teamId = teamId; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }

    public void setTasks(List<ToDoItem> tasks) {
        this.tasks = tasks;
    }

    public List<ToDoItem> getTasks() {
        return tasks;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    // Add toString method to include User
    @Override
    public String toString() {
        return "Employee{" +
                "id=" + id +
                ", userId=" + userId +
                ", teamId=" + teamId +
                ", role='" + role + '\'' +
                ", createdAt=" + createdAt +
                ", user=" + user +
                '}';
    }
}
