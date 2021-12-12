package com.example.VaccinationManagementSystem.Controller;


import com.example.VaccinationManagementSystem.Model.ErrorDetail;
import com.example.VaccinationManagementSystem.Model.ErrorResponse;
import com.example.VaccinationManagementSystem.Model.SuccessResponse;
import com.example.VaccinationManagementSystem.Service.VaccineService;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
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
    //@PostMapping(params = {"name", "diseases", "manufacturer", "numOfShots", "shotInternalVal", "duration"})
    @PostMapping()
    public @ResponseBody
    Object createVaccine(
            @RequestBody String payload
    ) {
        try {
            JSONObject vaccine = new JSONObject(payload);
            String name = (String) vaccine.get("name");
            JSONArray diseases = (JSONArray)vaccine.get("diseaseIds");
            String manufacturer = (String) vaccine.get("manufacturer");
            Integer numOfShots = (Integer) vaccine.get("numOfShots");
            Integer shotInternalVal = (Integer) vaccine.get("shotInternalVal");
            Integer duration = (Integer) vaccine.get("duration");
            List<Integer> diseasesIds = new ArrayList<>();
            if (diseases != null) {
                int len = diseases.length();
                for (int i=0;i<len;i++){
                    diseasesIds.add((Integer) diseases.get(i));
                }
            }

            return vaccineService.createVaccine(name, diseasesIds, manufacturer, numOfShots, shotInternalVal, duration);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(new ErrorDetail("400", e.getMessage())));
        }
    }

    //String name, List<Disease> diseases, String manufacturer, Integer numOfShots, Integer shotInternalVal, Integer duration
    /*@PutMapping(path = "{vaccineId}")
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
    }*/

}
