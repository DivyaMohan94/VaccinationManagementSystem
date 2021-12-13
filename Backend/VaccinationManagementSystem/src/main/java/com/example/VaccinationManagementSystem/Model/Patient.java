package com.example.VaccinationManagementSystem.Model;


import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.Date;
import java.util.UUID;

@Entity
@Table
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class,
        property = "mrn")
public class Patient {
    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "org.hibernate.id.UUIDGenerator")
    private UUID mrn;
    private String emailId;
    private String fname;
    private String mname;
    private String lname;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd-HH",timezone = "PST")
    private Date dob;
    private String gender;
    private boolean isAdmin;
    @Embedded
    private Address address;

    public Patient(UUID mrn, String emailId, String fname, String mname, String lname, Date dob, String gender, boolean isAdmin, Address address) {
        this.mrn = mrn;
        this.emailId = emailId;
        this.fname = fname;
        this.mname = mname;
        this.lname = lname;
        this.dob = dob;
        this.gender = gender;
        this.isAdmin = isAdmin;
        this.address = address;
    }

    public Patient() {

    }

    public UUID getMrn() {
        return mrn;
    }

    public void setMrn(UUID mrn) {
        this.mrn = mrn;
    }

    public String getEmailId() {
        return emailId;
    }

    public void setEmailId(String emailId) {
        this.emailId = emailId;
    }

    public String getFname() {
        return fname;
    }

    public void setFname(String fname) {
        this.fname = fname;
    }

    public String getMname() {
        return mname;
    }

    public void setMname(String mname) {
        this.mname = mname;
    }

    public String getLname() {
        return lname;
    }

    public void setLname(String lname) {
        this.lname = lname;
    }

    public Date getDob() {
        return dob;
    }

    public void setDob(Date dob) {
        this.dob = dob;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public boolean isAdmin() {
        return isAdmin;
    }

    public void setAdmin(boolean admin) {
        isAdmin = admin;
    }

    public Address getAddress() {
        return address;
    }

    public void setAddress(Address address) {
        this.address = address;
    }
}
