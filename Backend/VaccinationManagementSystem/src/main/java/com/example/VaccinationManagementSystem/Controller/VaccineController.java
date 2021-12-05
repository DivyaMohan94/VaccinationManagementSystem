package com.example.VaccinationManagementSystem.Controller;


import com.example.VaccinationManagementSystem.Model.ErrorDetail;
import com.example.VaccinationManagementSystem.Model.ErrorResponse;
import com.example.VaccinationManagementSystem.Model.SuccessResponse;
import com.example.VaccinationManagementSystem.Service.VaccineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/vaccine")
public class VaccineController {

    private final VaccineService vaccineService;

    @Autowired
    public VaccineController(VaccineService vaccineService) {
        this.vaccineService = vaccineService;
    }


    //String name, List<Disease> diseases, String manufacturer, Integer numOfShots, Integer shotInternalVal, Integer duration
    @PostMapping(params = {"name", "diseases", "manufacturer", "numOfShots", "shotInternalVal", "duration"})
    public @ResponseBody
    Object createVaccine(
            @RequestParam(value = "name") String name,
            @RequestParam(value = "diseases") List<String> diseases,
            @RequestParam(value = "manufacturer") String manufacturer,
            @RequestParam(value = "numOfShots") Integer numOfShots,
            @RequestParam(value = "shotInternalVal", required = false) Integer shotInternalVal,
            @RequestParam(value = "duration") Integer duration
    ) {
        try {
            return vaccineService.createVaccine(name, diseases, manufacturer, numOfShots, shotInternalVal, duration);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(new ErrorDetail("400", e.getMessage())));
        }
    }

    //String name, List<Disease> diseases, String manufacturer, Integer numOfShots, Integer shotInternalVal, Integer duration
    @PutMapping(path = "{vaccineId}")
    public @ResponseBody
    Object updateVaccine(@PathVariable("vaccineId") Integer vaccineId,
                         @RequestParam(value = "name", required = false) String name,
                         @RequestParam(value = "diseases", required = false) List<String> diseases,
                         @RequestParam(value = "manufacturer", required = false) String manufacturer,
                         @RequestParam(value = "numOfShots", required = false) Integer numOfShots,
                         @RequestParam(value = "shotInternalVal", required = false) Integer shotInternalVal,
                         @RequestParam(value = "duration", required = false) Integer duration
    ) {
        try {
            return vaccineService.updateVaccine(vaccineId, name, diseases, manufacturer, numOfShots, shotInternalVal, duration);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponse(new ErrorDetail("404", e.getMessage())));
        }
    }

    @DeleteMapping(path = "{vaccineId}")
    public @ResponseBody
    Object deleteVaccine(@PathVariable("vaccineId") Integer vaccineId) {
        try {
            vaccineService.deleteVaccine(vaccineId);
            return ResponseEntity.ok().body(new SuccessResponse("200", "Clinic with id " + vaccineId + " is deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(new ErrorDetail("404", e.getMessage())));
        }
    }

}
