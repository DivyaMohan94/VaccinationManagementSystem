package com.example.VaccinationManagementSystem.Model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import org.hibernate.type.LocalTimeType;

import javax.persistence.*;
import java.time.LocalTime;
import java.util.Date;

@Entity
@Table(name = "Clinic")
//@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class,
//        property = "clinicId")
public class Clinic {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Integer clinicId;   // primary key
    private String name; //must be unique
    @Embedded
    private Address address;
//    private String businessHours;
    private LocalTime startTime;
    private LocalTime endTime;
    private Integer numOfPhysicians;

    private static LocalTime earliestStartTime;
    private static LocalTime latestEndTime;

    public Clinic(String name, Address address,
//                  String businessHours,
                  Integer numOfPhysicians, LocalTime startTime, LocalTime endTime) {
        this.name = name;
        this.address = address;
//        this.businessHours = businessHours;
        this.numOfPhysicians = numOfPhysicians;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    public Clinic() {
    }

    public static LocalTime getEarliestStartTime() {
        return earliestStartTime;
    }

    public static void setEarliestStartTime(LocalTime earliestStartTime) {
        Clinic.earliestStartTime = earliestStartTime;
    }

    public static LocalTime getLatestEndTime() {
        return latestEndTime;
    }

    public static void setLatestEndTime(LocalTime latestEndTime) {
        Clinic.latestEndTime = latestEndTime;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
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

//    public String getBusinessHours() {
//        return businessHours;
//    }
//
//    public void setBusinessHours(String businessHours) {
//        this.businessHours = businessHours;
//    }

    public Integer getNumOfPhysicians() {
        return numOfPhysicians;
    }

    public void setNumOfPhysicians(Integer numOfPhysicians) {
        this.numOfPhysicians = numOfPhysicians;
    }
}

