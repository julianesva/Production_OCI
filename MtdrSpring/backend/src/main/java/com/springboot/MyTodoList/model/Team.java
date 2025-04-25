package com.springboot.MyTodoList.model;

import javax.persistence.*;

@Entity
@Table(name = "TEAMS")
public class Team {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "TEAM_ID")
    private int id;

    @Column(name = "TEAM_NAME")
    private String name;

    @Column(name = "TEAM_SIZE")
    private int size;

    @Column(name = "MANAGER")
    private int manager;

    // Default constructor
    public Team() {
    }

    // Full constructor
    public Team(int id, String name, int size, int manager) {
        this.id = id;
        this.name = name;
        this.size = size;
        this.manager = manager;
    }

    // Getters and Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getSize() {
        return size;
    }

    public void setSize(int size) {
        this.size = size;
    }

    public int getManager() {
        return manager;
    }

    public void setManager(int manager) {
        this.manager = manager;
    }

    @Override
    public String toString() {
        return "Team{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", size=" + size +
                ", manager=" + manager +
                '}';
    }
}