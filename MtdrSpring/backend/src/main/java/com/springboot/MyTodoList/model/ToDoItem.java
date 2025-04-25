package com.springboot.MyTodoList.model;

import javax.persistence.*;

import org.apache.tomcat.jni.Local;

import java.time.LocalDate;
import java.time.OffsetDateTime;

@Entity
@Table(name = "TASKS")
public class ToDoItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "TASK_ID")  // Match the exact column name from DB
    private int id;

    @Column(name = "TITLE")
    private String title;

    @Column(name = "MODULE_ID")
    private int moduleId = 1;

    @Column(name = "DESCRIPTION")
    private String description;

    @Column(name = "DATE_LIMIT")
    private LocalDate dateLimit;

    @Column(name = "RESPONSIBLE")
    private int responsible = 2;
    
    @Column(name = "ENDING_DATE") 
    private LocalDate endingDate;

    @Column(name = "ESTIMATED_TIME")
    private int estimatedTime;

    @Column(name = "ACTUAL_TIME")
    private Integer actualTime;

    @Column(name = "CREATION_TS")
    private OffsetDateTime creation_ts;

    @Column(name = "DONE")
    private boolean done;

    @Column(name = "STORY_POINTS")
    private int story_Points;

    // Default constructor
    public ToDoItem() {
    }

    // Full constructor matching all fields
    public ToDoItem(int id, String title, int moduleId, String description, 
                   LocalDate dateLimit, int responsible, LocalDate endingDate,
                   int estimatedTime, Integer actualTime, OffsetDateTime creationTs, 
                   boolean done, int storyPoints) {
        this.id = id;
        this.title = title;
        this.moduleId = moduleId;
        this.description = description;
        this.dateLimit = dateLimit;
        this.responsible = responsible;
        this.endingDate = endingDate;
        this.estimatedTime = estimatedTime;
        this.actualTime = actualTime;
        this.creation_ts = creationTs;
        this.done = done;
        this.story_Points = storyPoints;
    }

    // Getters and setters with consistent naming
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public int getModuleId() {
        return moduleId;
    }

    public void setModuleId(int moduleId) {
        this.moduleId = moduleId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getDateLimit() {
        return dateLimit;
    }

    public void setDateLimit(LocalDate dateLimit) {
        this.dateLimit = dateLimit;
    }

    public int getResponsible() {
        return responsible;
    }

    public void setResponsible(int responsible) {
        this.responsible = responsible;
    }
    
    public LocalDate getEndingDate() {
        return endingDate;
    }

    public void setEndingDate(LocalDate endingDate) {
        this.endingDate = endingDate;
    }

    public int getEstimatedTime() {
        return estimatedTime;
    }

    public void setEstimatedTime(int estimatedTime) {
        this.estimatedTime = estimatedTime;
    }

    public Integer getActualTime() {
        return actualTime;
    }

    public void setActualTime(Integer actualTime) {
        this.actualTime = actualTime;
    }

    public OffsetDateTime getCreation_ts() {
        return creation_ts;
    }

    public void setCreation_ts(OffsetDateTime creationTs) {
        this.creation_ts = creationTs;
    }

    public boolean isDone() {
        return done;
    }

    public void setDone(boolean done) {
        this.done = done;
    }

    public int getStory_Points() {
        return story_Points;
    }

    public void setStory_Points(int storyPoints) {
        this.story_Points = storyPoints;
    }

    @Override
    public String toString() {
        return "ToDoItem{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", moduleId=" + moduleId +
                ", description='" + description + '\'' +
                ", dateLimit=" + dateLimit +
                ", responsible=" + responsible +
                ", endingDate=" + endingDate +
                ", estimatedTime=" + estimatedTime +
                ", actualTime=" + actualTime +
                ", creation_ts=" + creation_ts +
                ", done=" + done +
                ", story_Points=" + story_Points +
                '}';
    }
}