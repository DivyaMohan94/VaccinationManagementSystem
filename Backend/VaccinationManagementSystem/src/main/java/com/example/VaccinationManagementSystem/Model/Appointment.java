package com.example.VaccinationManagementSystem.Model;


import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "Appointment")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class,
        property = "appointmentId")
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String appointmentId;   // primary key
    private UUID patientId; //MRN number
    private Integer clinicId;
    @OneToMany(mappedBy = "Appointment")
    private List<Vaccine> vaccines = new ArrayList<>();
    private String slot;
    private String status;

    public Appointment(String appointmentId, UUID patientId, Integer clinicId, List<Vaccine> vaccines, String slot, String status) {
        this.appointmentId = appointmentId;
        this.patientId = patientId;
        this.clinicId = clinicId;
        this.vaccines = vaccines;
        this.slot = slot;
        this.status = status;
    }

    public Appointment() {

    }

    public String getAppointmentId() {
        return appointmentId;
    }

    public void setAppointmentId(String appointmentId) {
        this.appointmentId = appointmentId;
    }

    public UUID getPatientId() {
        return patientId;
    }

    public void setPatientId(UUID patientId) {
        this.patientId = patientId;
    }

    public Integer getClinicId() {
        return clinicId;
    }

    public void setClinicId(Integer clinicId) {
        this.clinicId = clinicId;
    }

    public List<Vaccine> getVaccines() {
        return vaccines;
    }

    public void setVaccines(List<Vaccine> vaccines) {
        this.vaccines = vaccines;
    }

    public String getSlot() {
        return slot;
    }

    public void setSlot(String slot) {
        this.slot = slot;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
