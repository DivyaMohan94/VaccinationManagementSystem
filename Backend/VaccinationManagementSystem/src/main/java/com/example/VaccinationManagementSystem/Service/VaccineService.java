package com.example.VaccinationManagementSystem.Service;

import com.example.VaccinationManagementSystem.Model.Disease;
import com.example.VaccinationManagementSystem.Model.Vaccine;
import com.example.VaccinationManagementSystem.Repository.DiseaseRepository;
import com.example.VaccinationManagementSystem.Repository.VaccineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@Service
public class VaccineService {

    private final VaccineRepository vaccineRepository;
    private final DiseaseRepository diseaseRepository;

    @Autowired
    public VaccineService(VaccineRepository vaccineRepository, DiseaseRepository diseaseRepository) {
        this.vaccineRepository = vaccineRepository;
        this.diseaseRepository = diseaseRepository;
    }

    @Transactional(rollbackOn = {IOException.class, SQLException.class})
    public Object createVaccine(String name, List<Integer> diseases, String manufacturer, Integer numOfShots, Integer shotInternalVal, Integer duration) {
        List<Disease> diseasesList;
        diseasesList = getDiseaseList(diseases);
        if (numOfShots == 1) {
            shotInternalVal = 0;
        }
        Vaccine vaccine = new Vaccine(name, diseasesList, manufacturer, numOfShots, shotInternalVal, duration);
        vaccineRepository.save(vaccine);
        return vaccine;
    }
   private List<Disease> getDiseaseList(List<Integer> diseases) {
        List<Disease> diseasesList = new ArrayList<>();

        for (Integer disease : diseases) {
            Disease current = diseaseRepository.findByDiseaseId(disease);
            if (current != null) {
                diseasesList.add(current);
            } else {
                throw new IllegalStateException("Sorry, disease " + disease + " does not exist.");
            }
        }
        return diseasesList;
    }
}
