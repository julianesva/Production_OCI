package com.springboot.MyTodoList.model;

import javax.persistence.*;

@Entity
@Table(name = "TEAMS_WORKING_MODULES")
public class TeamWorkingModule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private int id;

    @Column(name = "MODULE_ID")
    private int moduleId;

    @Column(name = "TEAM_ID")
    private int teamId;

    // Default constructor
    public TeamWorkingModule() {
    }

    // Full constructor
    public TeamWorkingModule(int id, int moduleId, int teamId) {
        this.id = id;
        this.moduleId = moduleId;
        this.teamId = teamId;
    }

    // Getters and Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getModuleId() {
        return moduleId;
    }

    public void setModuleId(int moduleId) {
        this.moduleId = moduleId;
    }

    public int getTeamId() {
        return teamId;
    }

    public void setTeamId(int teamId) {
        this.teamId = teamId;
    }

    @Override
    public String toString() {
        return "TeamWorkingModule{" +
                "id=" + id +
                ", moduleId=" + moduleId +
                ", teamId=" + teamId +
                '}';
    }
}