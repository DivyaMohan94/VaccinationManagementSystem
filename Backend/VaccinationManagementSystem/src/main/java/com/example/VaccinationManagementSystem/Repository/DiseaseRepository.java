package com.example.VaccinationManagementSystem.Repository;

import com.example.VaccinationManagementSystem.Model.Disease;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DiseaseRepository extends JpaRepository<Disease, Integer> {
    Disease findByName(String name);
    Disease findByDiseaseId(Integer Id);
}