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
    private String diseaseId;   // primary key
    private String name;
    private String description;

    public Disease(String diseaseId, String name, String description) {
        this.diseaseId = diseaseId;
        this.name = name;
        this.description = description;
    }

    public Disease() {

    }

    public String getDiseaseId() {
        return diseaseId;
    }

    public void setDiseaseId(String diseaseId) {
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
