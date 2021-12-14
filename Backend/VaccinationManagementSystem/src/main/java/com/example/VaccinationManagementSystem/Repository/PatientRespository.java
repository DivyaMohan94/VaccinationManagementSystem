package com.example.VaccinationManagementSystem.Repository;

import com.example.VaccinationManagementSystem.Model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PatientRespository extends JpaRepository<Patient, Integer> {
}
