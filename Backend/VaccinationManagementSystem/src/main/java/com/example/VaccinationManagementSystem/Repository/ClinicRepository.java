package com.example.VaccinationManagementSystem.Repository;

import com.example.VaccinationManagementSystem.Model.Clinic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClinicRepository extends JpaRepository<Clinic, Integer> {
    Optional<Clinic> findClinicByName(String name);
}
