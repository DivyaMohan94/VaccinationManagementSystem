package com.example.VaccinationManagementSystem.Model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import javax.persistence.*;

@Entity
@Table(name = "Clinic")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class,
        property = "clinicId")
public class Clinic {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Integer clinicId;   // primary key
    private String name; //must be unique
    @Embedded
    private Address address;
    private String businessHours;
    private Integer numOfPhysicians;

    public Clinic(String name, Address address, String businessHours, Integer numOfPhysicians) {
        this.name = name;
        this.address = address;
        this.businessHours = businessHours;
        this.numOfPhysicians = numOfPhysicians;
    }

    public Clinic(String name, String address, String businessHours, Integer numberOfNurses) {

    }

    public Clinic() {
    }

    public Integer getClinicId() {
        return clinicId;
    }

    public void setClinicId(Integer clinicId) {
        this.clinicId = clinicId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Address getAddress() {
        return address;
    }

    public void setAddress(Address address) {
        this.address = address;
    }

    public String getBusinessHours() {
        return businessHours;
    }

    public void setBusinessHours(String businessHours) {
        this.businessHours = businessHours;
    }

    public Integer getNumOfPhysicians() {
        return numOfPhysicians;
    }

    public void setNumOfPhysicians(Integer numOfPhysicians) {
        this.numOfPhysicians = numOfPhysicians;
    }
}

