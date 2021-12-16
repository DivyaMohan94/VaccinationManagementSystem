package com.example.VaccinationManagementSystem.Service;

import com.example.VaccinationManagementSystem.Model.Disease;
import com.example.VaccinationManagementSystem.Repository.DiseaseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

@Service
public class DiseaseService {

    private final DiseaseRepository diseaseRepository;

    @Autowired
    public DiseaseService(DiseaseRepository diseaseRepository) {
        this.diseaseRepository = diseaseRepository;
    }

    @Transactional(rollbackOn = {IOException.class, SQLException.class})
    public Object createDisease(String name, String description) {
        Disease disease = new Disease(name, description);
        diseaseRepository.save(disease);
        return disease;
    }

    @Transactional(rollbackOn = {IOException.class, SQLException.class})
    public Object updateDisease(Integer diseaseId, String name, String description) {

        if(diseaseRepository.existsById(diseaseId)){
            Disease disease = diseaseRepository.findById(diseaseId).get();
            if(name != null && name.length() != 0 && name != disease.getName()) disease.setName(name);
            if(description != null && description.length() != 0 && description != disease.getDescription()) disease.setDescription(description);
            diseaseRepository.save(disease);
            return disease;
        }else{
            throw new IllegalStateException("Sorry, the requested disease with " + diseaseId + " does not exist.");
        }
    }

    @Transactional(rollbackOn = {IOException.class, SQLException.class})
    public Object getAllDiseases() {
            List<Disease> diseases = (List<Disease>) diseaseRepository.findAll();
            if(diseases != null){
                return diseases;
            }else{
                throw new IllegalStateException("Sorry, no diseases found");
            }
    }
}