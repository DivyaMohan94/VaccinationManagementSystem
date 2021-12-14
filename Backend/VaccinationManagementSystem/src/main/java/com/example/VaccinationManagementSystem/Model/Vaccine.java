package com.example.VaccinationManagementSystem.Model;


import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import org.hibernate.validator.constraints.Length;
import org.springframework.beans.factory.annotation.Value;

import javax.persistence.*;
import javax.validation.constraints.Min;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "Vaccine")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class,
        property = "vaccineId")
public class Vaccine {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer vaccineId;   // primary key
    @Column(unique = true)
    private String name;
    /* @OneToMany(targetEntity=Disease.class,cascade = CascadeType.ALL,
             fetch = FetchType.LAZY, orphanRemoval = true)
     //@JoinColumn(name = "vaccineId")*/
    @ManyToMany(targetEntity = Disease.class, cascade = CascadeType.ALL)
    private List<Disease> diseases = new ArrayList<>();
//    @Length(min = 3, max = 100, message = "Manufacturer must be at least 3 characters")
    private String manufacturer;
    @Min(value = 1, message = "Number of shots must be at least 1")
    private Integer numOfShots;
    private Integer shotInternalVal;
    private Integer duration;

    public Vaccine(String name, List<Disease> diseases, String manufacturer, Integer numOfShots, Integer shotInternalVal, Integer duration) {
        this.name = name;
        this.diseases = diseases;
        this.manufacturer = manufacturer;
        this.numOfShots = numOfShots;
        this.shotInternalVal = shotInternalVal;
        this.duration = duration;
    }

    public Vaccine() {

    }

    public Integer getVaccineId() {
        return vaccineId;
    }

    public void setVaccineId(Integer vaccineId) {
        this.vaccineId = vaccineId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<Disease> getDiseases() {
        return diseases;
    }

    public void setDiseases(List<Disease> diseases) {
        this.diseases = diseases;
    }

    public String getManufacturer() {
        return manufacturer;
    }

    public void setManufacturer(String manufacturer) {
        manufacturer = manufacturer;
    }

    public Integer getNumOfShots() {
        return numOfShots;
    }

    public void setNumOfShots(Integer numOfShots) {
        this.numOfShots = numOfShots;
    }

    public Integer getShotInternalVal() {
        return shotInternalVal;
    }

    public void setShotInternalVal(Integer shotInternalVal) {
        shotInternalVal = shotInternalVal;
    }

    public Integer getDuration() {
        return duration;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }
}


