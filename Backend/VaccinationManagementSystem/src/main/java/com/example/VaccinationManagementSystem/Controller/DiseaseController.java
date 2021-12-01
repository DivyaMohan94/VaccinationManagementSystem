package com.example.VaccinationManagementSystem.Controller;

import com.example.VaccinationManagementSystem.Model.ErrorDetail;
import com.example.VaccinationManagementSystem.Model.ErrorResponse;
import com.example.VaccinationManagementSystem.Service.DiseaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "/disease")
public class DiseaseController {
    private final DiseaseService diseaseService;

    @Autowired
    public DiseaseController(DiseaseService diseaseService) {
        this.diseaseService = diseaseService;
    }

    @PostMapping(params = {"name", "description"})
    public @ResponseBody
    Object createDisease(
            @RequestParam(value = "name", required = true) String name,
            @RequestParam(value = "description") String description
    ) {
        try {
            return diseaseService.createDisease(name, description);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(new ErrorDetail("400", e.getMessage())));
        }
    }

    @PutMapping(path = "{diseaseId}")
    public @ResponseBody
    Object updateDisease(@PathVariable("diseaseId") Integer diseaseId,
                         @RequestParam(value = "name", required = false) String name,
                         @RequestParam(value = "description", required = false) String description
                         ) {
        try {
            return diseaseService.updateDisease(diseaseId, name, description);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponse(new ErrorDetail("404", e.getMessage())));
        }
    }
}