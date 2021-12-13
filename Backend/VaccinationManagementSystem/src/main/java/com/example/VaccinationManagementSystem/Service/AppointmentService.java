package com.example.VaccinationManagementSystem.Service;

import com.example.VaccinationManagementSystem.Model.Appointment;
import com.example.VaccinationManagementSystem.Model.Vaccine;
import com.example.VaccinationManagementSystem.Repository.AppointmentRepository;
import com.example.VaccinationManagementSystem.Repository.VaccineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.io.IOException;
import java.sql.SQLException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;
import java.util.concurrent.TimeUnit;

@Service
public class AppointmentService {
    private final AppointmentRepository appointmentRepository;
    private final VaccineRepository vaccineRepository;

    @Autowired
    public AppointmentService(AppointmentRepository appointmentRepository, VaccineRepository vaccineRepository) {
        this.appointmentRepository = appointmentRepository;
        this.vaccineRepository = vaccineRepository;
    }

    @Transactional(rollbackOn = {IOException.class, SQLException.class})

    public Object makeAppointment(Integer patient_id, Integer clinic_id, String date, LocalTime slot,
                                  String current_date, List<Integer> vaccines) throws ParseException {

        Date appointmentDate = null;
        Date currentDate = null;
        System.out.println("Inside Appointment service");
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd-HH:mm", Locale.US);
        String datetime = date + "-" + slot.toString();
        appointmentDate = dateFormat.parse(datetime);
        SimpleDateFormat currentdateFormat = new SimpleDateFormat("yyyy-MM-dd-HH-mm-ss", Locale.US);
        currentDate = currentdateFormat.parse(current_date);
        List<Vaccine> vaccines1 = new ArrayList<>();
        for (int i = 0; i < vaccines.size(); i++) {
            vaccines1.add(vaccineRepository.findById(vaccines.get(i)).get());
        }
        Appointment appointment = new Appointment(patient_id, clinic_id, appointmentDate, slot, "booked", vaccines1, currentDate);
        appointmentRepository.save(appointment);
        return appointment;
    }


    @Transactional(rollbackOn = {IOException.class, SQLException.class})
    public Object updateAppointment(Integer appointmentId, Integer clinic_id, String date, LocalTime slot, List<Integer> vaccines) throws ParseException {
        Appointment appointment = appointmentRepository.findById(appointmentId).get();
        if (!clinic_id.equals(appointment.getClinicId())) appointment.setClinicId(clinic_id);
        Date appointmentDate = null;
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd-HH:mm:ss", Locale.US);
        appointmentDate = dateFormat.parse(date);
        if (!appointmentDate.equals(appointment.getDate())) appointment.setDate(appointmentDate);
        if (!slot.equals(appointment.getSlot())) appointment.setSlot(slot);
        List<Vaccine> vaccines1 = new ArrayList<>();
        for (int i = 0; i < vaccines.size(); i++) {
            vaccines1.add(vaccineRepository.findById(vaccines.get(i)).get());
        }
        System.out.println("Inside update Appointment service+++++" + appointment);
        return appointment;
    }

    @Transactional(rollbackOn = {IOException.class, SQLException.class})
    public void cancelAppointment(Integer appointmentId) {
        boolean appointmentExists = appointmentRepository.existsById(appointmentId);
        if (!appointmentExists) {
            throw new IllegalStateException("Appointment with " + appointmentId + " does not exist.");
        }
        appointmentRepository.deleteById(appointmentId);
    }

    @Transactional(rollbackOn = {IOException.class, SQLException.class})
    public Object getPastAppointment(Integer patient_id, String current_date) throws ParseException {
        Date cdate = null;
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd-HH-mm-ss", Locale.US);
        cdate = dateFormat.parse(current_date);
        List<Appointment> appointments = appointmentRepository.getPastAppointments(cdate, patient_id);
        List<Appointment> results = appointments;
        //need to handle this in front end as setter method will change DB status.
        /*
        for(int i=0;i<appointments.size();i++){
            if((appointments.get(i)).getStatus().equals("booked")){
                (results.get(i)).setStatus("No Show");
            } else if ((appointments.get(i)).getStatus().equals("Checked-In")){
                (results.get(i)).setStatus("Completed");
            }
        } */
        return results;
    }

    @Transactional(rollbackOn = {IOException.class, SQLException.class})
    public Object getFutureAppointment(Integer patient_id, String current_date) throws ParseException {
        Date cdate = null;
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd-HH-mm-ss", Locale.US);
        cdate = dateFormat.parse(current_date);
        List<Appointment> appointments = appointmentRepository.getFutureAppointments(cdate, patient_id);
        return appointments;
    }

    @Transactional(rollbackOn = {IOException.class, SQLException.class})
    public Object getCheckinAppointment(Integer patient_id, String current_date) throws ParseException {
        Date cdate = null;
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyy-MM-dd-HH-mm-ss", Locale.US);
        cdate = dateFormat.parse(current_date);
        Calendar cal = Calendar.getInstance(); // creates calendar
        cal.setTime(cdate);               // sets calendar time/date
        cal.add(Calendar.HOUR_OF_DAY, 24);      // adds 24 hour
        List<Appointment> appointments = appointmentRepository.getCheckinAppointments(cdate, cal.getTime(), patient_id);
        return appointments;
    }

    @Transactional(rollbackOn = {IOException.class, SQLException.class})
    public Object makeCheckinAppointment(Integer patient_id, Integer appointment_id) throws ParseException {
        Appointment appointment = appointmentRepository.findById(appointment_id).get();
        appointment.setStatus("Checked In");
        return appointment;
    }

    public Object getDueAppointments(Integer patientId, String currentDate) throws ParseException {
        //Consider 12 months duration for due vaccinations
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd", Locale.US);
        Date currDate = dateFormat.parse(currentDate);

        List<VaccineDueModel> vaccinationsDue = new LinkedList<>();

        List<Appointment> pastAppointments = appointmentRepository.getPastAppointments(currDate, patientId);

        List<Appointment> pastCompletedAppointments = (List<Appointment>) pastAppointments.stream().filter(app -> app.getStatus() == "Checked In");

        HashMap<String, List<Appointment>> shotsTaken = new HashMap<>();

        for (Appointment appointment : pastCompletedAppointments) {
            for (Vaccine vaccine : appointment.getVaccines()) {
                String vaccineName = vaccine.getName();
                if (shotsTaken.containsKey(vaccineName)) shotsTaken.get(vaccineName).add(appointment);
                shotsTaken.putIfAbsent(vaccineName, new LinkedList<>(Arrays.asList(appointment)));
            }
        }

        System.out.println("All shots taken" + shotsTaken);

        List<Vaccine> allVaccines = vaccineRepository.findAll();

        System.out.println(allVaccines);

        for (Vaccine vaccine : allVaccines) {
            //Patient has taken this vaccine before
            String vaccineName = vaccine.getName();
            Integer vaccineShots = vaccine.getNumOfShots();
            if (shotsTaken.containsKey(vaccineName)) {
                Integer pendingShots = vaccineShots - shotsTaken.get(vaccineName).size();
                Appointment lastAppt = shotsTaken.get(vaccineName).get(shotsTaken.get(vaccineName).size() - 1);

                //Total number of shots taken is less than mandatory number of doses
                if (pendingShots > 0) {
                    Date dueDate = new SimpleDateFormat("dd/MM/yyyy").parse(LocalDate.parse(lastAppt.toString()).plusDays(vaccine.getDuration()).toString());
                    vaccinationsDue.add(new VaccineDueModel(vaccineName, shotsTaken.get(vaccineName).size() + 1, dueDate));
                }

                //Total number of shots taken is equal to mandatory number of doses
                if (pendingShots == 0) {
                    if (vaccine.getDuration() != -1) {
                        long diffInMillies = Math.abs(currDate.getTime() - lastAppt.getDate().getTime());
                        long diff = TimeUnit.DAYS.convert(diffInMillies, TimeUnit.MILLISECONDS);
                        Date dueDate = new SimpleDateFormat("dd/MM/yyyy").parse(LocalDate.parse(lastAppt.toString()).plusDays(vaccine.getDuration()).toString());
                        if (diff > vaccine.getDuration() && currDate.after(lastAppt.getDate()))
                            vaccinationsDue.add(new VaccineDueModel(vaccineName, shotsTaken.get(vaccineName).size() + 1, dueDate));
                    }
                }
            } else
                vaccinationsDue.add(new VaccineDueModel(vaccineName, 1, new SimpleDateFormat("dd/MM/yyyy").parse(LocalDate.parse(LocalDate.now().toString()).toString())));

        }

        return vaccinationsDue;
    }

    public class VaccineDueModel {
        String vaccineName;
        Integer shotNumber;
        Date dueDate;

        public VaccineDueModel(String vaccineName, Integer shotNumber, Date dueDate) {
            this.vaccineName = vaccineName;
            this.shotNumber = shotNumber;
            this.dueDate = dueDate;
        }

        public String getVaccineName() {
            return vaccineName;
        }

        public void setVaccineName(String vaccineName) {
            this.vaccineName = vaccineName;
        }

        public Integer getShotNumber() {
            return shotNumber;
        }

        public void setShotNumber(Integer shotNumber) {
            this.shotNumber = shotNumber;
        }

        public Date getDueDate() {
            return dueDate;
        }

        public void setDueDate(Date dueDate) {
            this.dueDate = dueDate;
        }
    }
}
