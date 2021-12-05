package com.example.VaccinationManagementSystem.Repository;

import com.example.VaccinationManagementSystem.Model.Vaccine;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VaccineRepository extends JpaRepository<Vaccine, Integer> {
}
