package com.example.VaccinationManagementSystem.Model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import javax.persistence.*;

@Entity
@Table(name = "Disease")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class,
        property = "diseaseId")
public class Disease {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer diseaseId;   // primary key
    @Column(unique = true)
    private String name;
    private String description;

    public Disease(Integer diseaseId, String name, String description) {
        this.diseaseId = diseaseId;
        this.name = name;
        this.description = description;
    }

    public Disease() {

    }

    public Disease(String name, String description) {
        this.name = name;
        this.description = description;
    }

    public Integer getDiseaseId() {
        return diseaseId;
    }

    public void setDiseaseId(Integer diseaseId) {
        this.diseaseId = diseaseId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
