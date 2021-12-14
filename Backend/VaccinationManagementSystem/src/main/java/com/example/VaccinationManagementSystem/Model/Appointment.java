package com.example.VaccinationManagementSystem.Model;


import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.example.VaccinationManagementSystem.Model.AppointmentStatus;
import javax.persistence.*;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "Appointment")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class,
        property = "appointmentId")
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer appointmentId;   // primary key
    private Integer patientId; //MRN number
    private Integer clinicId;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd-HH:mm",timezone = "PST")
    private Date appointment_date;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd-HH-mm-ss",timezone = "PST")
    private Date created_date;
    private LocalTime slot;
    @ManyToMany (targetEntity = Vaccine.class)
    private List<Vaccine> vaccines = new ArrayList<>();
    @Enumerated(EnumType.STRING)
    private AppointmentStatus status;



    public Appointment(Integer patientId, Integer clinicId, Date date, LocalTime slot, AppointmentStatus status, List vaccines, Date created_date) {

        this.patientId = patientId;
        this.clinicId = clinicId;
        this.appointment_date = date;
        this.slot = slot;
        this.vaccines = vaccines;
        this.created_date = created_date;
        this.status = status;
    }

    public Appointment() {

    }


    public Integer getAppointmentId() {
        return appointmentId;
    }

    public void setAppointmentId(Integer appointmentId) {
        this.appointmentId = appointmentId;
    }

    public Integer getPatientId() {
        return patientId;
    }

    public void setPatientId(Integer patientId) {
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

    public Date getDate() {
        return appointment_date;
    }

    public void setDate(Date appointment_date) {
        this.appointment_date = appointment_date;
    }

    public Date getCurrentDate() {
        return created_date;
    }

    public void setCurrentDate(Date created_date) {
        this.created_date = created_date;
    }
    public LocalTime getSlot() {
        return slot;
    }

    public void setSlot(LocalTime slot) {
        this.slot = slot;
    }

    public AppointmentStatus getStatus() {
        return status;
    }

    public void setStatus(AppointmentStatus status) {
        this.status = status;
    }
}
