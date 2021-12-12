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

        if (manufacturer.length() < 3) {
            throw new IllegalStateException("Sorry, the manufacturer name should be at least 3 characters");
        }

        if (numOfShots == 1) {
            shotInternalVal = 0;
            //duration = Integer.MAX_VALUE;
        }

        Vaccine vaccine = new Vaccine(name, diseasesList, manufacturer, numOfShots, shotInternalVal, duration);
        vaccineRepository.save(vaccine);
        return vaccine;
    }

    /*@Transactional(rollbackOn = {IOException.class, SQLException.class})
    public Object updateVaccine(Integer vaccineId, String name, List<String> diseases, String manufacturer, Integer numOfShots, Integer shotInternalVal, Integer duration) {

        List<Disease> diseasesList;

        diseasesList = getDiseaseList(diseases);

        if (vaccineRepository.existsById(vaccineId)) {
            Vaccine vaccine = vaccineRepository.findById(vaccineId).get();
            if (name != null && name.length() != 0 && name != vaccine.getName()) {
                vaccine.setName(name);
            }
            if (diseases != null && diseases.size() > 0 && diseasesList != vaccine.getDiseases()) {
                vaccine.getDiseases().addAll(diseasesList);
            }
            if (manufacturer != null && manufacturer.length() != 0 && manufacturer != vaccine.getManufacturer()) {
                vaccine.setManufacturer(manufacturer);
            }
            if (numOfShots != null && numOfShots != 0 && numOfShots != vaccine.getNumOfShots()) {
                vaccine.setNumOfShots(numOfShots);
            }
            if (shotInternalVal != null && shotInternalVal != 0 && shotInternalVal != vaccine.getShotInternalVal()) {
                vaccine.setShotInternalVal(shotInternalVal);
            }
            if (duration != null && duration != 0 && duration != vaccine.getDuration()) {
                vaccine.setDuration(duration);
            }

            vaccineRepository.save(vaccine);
            return vaccine;

        } else {
            throw new IllegalStateException("Sorry, the requested disease with " + vaccineId + " does not exist.");
        }
    }*/

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

    /*@Transactional(rollbackOn = {IOException.class, SQLException.class})
    public void deleteVaccine(Integer vaccineId) {
        boolean vaccine = vaccineRepository.existsById(vaccineId);
        if (!vaccine) {
            throw new IllegalStateException("Sorry, the requested clinicExists with ID " + vaccineId + " does not exist.");
        }
        vaccineRepository.deleteById(vaccineId);
    }*/

}
