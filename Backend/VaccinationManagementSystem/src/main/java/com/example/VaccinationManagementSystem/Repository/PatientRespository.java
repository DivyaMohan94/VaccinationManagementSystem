package com.example.VaccinationManagementSystem.Repository;

import com.example.VaccinationManagementSystem.Model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PatientRespository extends JpaRepository<Patient, Integer> {
    Patient findByEmailId(String emailId);
    Patient findByMrn(Integer mrn);
}
