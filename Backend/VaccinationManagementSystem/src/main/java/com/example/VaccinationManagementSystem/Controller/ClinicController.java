package com.example.VaccinationManagementSystem.Controller;

import com.example.VaccinationManagementSystem.Model.*;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.VaccinationManagementSystem.Service.ClinicService;

@RestController
@RequestMapping(path = "/clinic")
public class ClinicController {
    private final ClinicService clinicService;

    @Autowired
    public ClinicController(ClinicService clinicService) {
        this.clinicService = clinicService;
    }

    @PostMapping()
    public @ResponseBody
    Object createClinic(@RequestBody String payload) {
        try {
            System.out.println("Inside controller");
            JSONObject clinic = new JSONObject(payload);
            JSONObject address = new JSONObject(clinic.get("address").toString());

            Address add = new Address(
                    (String) address.get("street"),
                    (Integer) address.get("number"),
                    (String) address.get("city"),
                    (String) address.get("state"),
                    (String) address.get("zipcode"));

            System.out.println(add.getNumber());
            return clinicService.createClinic(
                    (String) clinic.get("name"),
                    add,
                    (String) clinic.get("businessHours"),
                    (Integer) clinic.get("numberOfPhysicians"));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(new ErrorDetail("400", e.getMessage())));
        }
    }

//    @PutMapping(path = "{clinicId}")
//    public @ResponseBody Object updatePassenger(@PathVariable("clinicId") Integer clinicId,
//                                                @RequestParam(value = "name", required = false) String name,
//                                                @RequestParam(value = "address", required = false) Address address,
//                                                @RequestParam(value = "businessHour", required = false) String businessHour,
//                                                @RequestParam(value = "numberOfPhysicians
//                                                ", required = false) Integer numberOfPhysicians

//    ){
//        try{
//            return clinicService.updateClinic(clinicId, name, address, businessHour, numberOfPhysicians
//            );
//        } catch(Exception e){
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponse(new ErrorDetail("404", e.getMessage())));
//        }
//    }
//
//    @DeleteMapping(path = "{clinicId}")
//    public @ResponseBody
//    Object deleteClinic(@PathVariable("clinicId") Integer clinicId) {
//        try {
//             clinicService.deleteClinic(clinicId);
//            return ResponseEntity.ok().body(new SuccessResponse("200", "Clinic with id "+clinicId+" is deleted successfully"));
//        } catch (Exception e) {
//            return ResponseEntity.badRequest().body(new ErrorResponse(new ErrorDetail("400", e.getMessage())));
//        }
//    }
}
