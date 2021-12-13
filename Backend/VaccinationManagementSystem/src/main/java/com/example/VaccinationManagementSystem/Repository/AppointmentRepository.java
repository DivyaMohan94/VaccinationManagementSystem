package com.example.VaccinationManagementSystem.Repository;

import com.example.VaccinationManagementSystem.Model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import javax.persistence.criteria.CriteriaBuilder;
import java.time.LocalTime;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AppointmentRepository  extends JpaRepository<Appointment, Integer>{
    @Query("SELECT appoint.clinicId FROM Appointment appoint where appoint.clinicId = ?1 and appoint.appointment_date =?2 and appoint.slot = ?3")
    List<Integer> getClinicAppointments(Integer clinic_id, Date selecteddate, LocalTime selectedSlot);

    @Query("SELECT appoint FROM Appointment appoint where appoint.appointment_date < ?1 and appoint.patientId = ?2 order by appoint.appointment_date")
    List<Appointment> getPastAppointments(Date currentDate, Integer patient_id);

    @Query("SELECT appoint FROM Appointment appoint where appoint.appointment_date >= ?1 and appoint.created_date <= ?1 and appoint.patientId = ?2 order by appoint.appointment_date")
    List<Appointment> getFutureAppointments(Date currentDate, Integer patient_id);

    @Query("SELECT appoint FROM Appointment appoint where appoint.appointment_date > ?1 and appoint.appointment_date < ?2 and appoint.patientId = ?3")
    List<Appointment> getCheckinAppointments(Date currentDate,Date hrDate, Integer patient_id);
    //    @Query("SELECT \n" +
//            "    v.vaccine_id,\n" +
//            "    COUNT(a.appointment_id),\n" +
//            "    v.num_of_shots,\n" +
//            "    MAX(a.appointment_date)\n" +
//            "FROM\n" +
//            "    Appointment a\n" +
//            "        INNER JOIN\n" +
//            "    appointment_vaccines av ON a.appointment_id = av.appointment_appointment_id\n" +
//            "        RIGHT OUTER JOIN\n" +
//            "    Vaccine v ON av.vaccines_vaccine_id = v.vaccine_id\n" +
//            "WHERE a.patientId = ?2 and a.created_date = ?1" +
//            "GROUP BY v.vaccine_id , v.num_of_shots")
//    List<AppointmentDueRecord> getDueAppointments(Date currentDate, Integer patient_id);
//
//    public class AppointmentDueRecord{
//        Integer vaccineId;
//        Integer vaccineCount;
//        Integer numberOfShotsNeeded;
//        Date lastAppointmentDate;
//
//        public Integer getVaccineId() {
//            return vaccineId;
//        }
//
//        public void setVaccineId(Integer vaccineId) {

//            this.vaccineId = vaccineId;
//        }
//
//        public Integer getVaccineCount() {
//            return vaccineCount;
//        }
//
//        public void setVaccineCount(Integer vaccineCount) {
//            this.vaccineCount = vaccineCount;
//        }
//
//        public Integer getNumberOfShotsNeeded() {
//            return numberOfShotsNeeded;
//        }
//
//        public void setNumberOfShotsNeeded(Integer numberOfShotsNeeded) {
//            this.numberOfShotsNeeded = numberOfShotsNeeded;
//        }
//
//        public Date getLastAppointmentDate() {
//            return lastAppointmentDate;
//        }
//
//        public void setLastAppointmentDate(Date lastAppointmentDate) {
//            this.lastAppointmentDate = lastAppointmentDate;
//        }
//    }

}
