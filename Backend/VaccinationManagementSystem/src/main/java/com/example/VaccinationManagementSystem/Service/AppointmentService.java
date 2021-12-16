package com.example.VaccinationManagementSystem.Service;

import com.example.VaccinationManagementSystem.Mail.NotificationService;
import com.example.VaccinationManagementSystem.Model.Appointment;
import com.example.VaccinationManagementSystem.Model.AppointmentStatus;
import com.example.VaccinationManagementSystem.Model.Clinic;
import com.example.VaccinationManagementSystem.Model.Vaccine;
import com.example.VaccinationManagementSystem.Repository.AppointmentRepository;
import com.example.VaccinationManagementSystem.Repository.ClinicRepository;
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
import java.util.stream.Collectors;

@Service
public class AppointmentService {
    private final AppointmentRepository appointmentRepository;
    private final VaccineRepository vaccineRepository;
    private final ClinicRepository clinicRepository;
    private final NotificationService notificationService;

    @Autowired
    public AppointmentService(AppointmentRepository appointmentRepository, VaccineRepository vaccineRepository, ClinicRepository clinicRepository, NotificationService notificationService) {
        this.appointmentRepository = appointmentRepository;
        this.vaccineRepository = vaccineRepository;
        this.clinicRepository = clinicRepository;
        this.notificationService = notificationService;
    }

    @Transactional(rollbackOn = {IOException.class, SQLException.class})

    public Object makeAppointment(Integer patient_id, Integer clinic_id, String date, LocalTime slot,
                                  String current_date, List<Integer> vaccines) throws ParseException {

        Date appointmentDate = null;
        Date currentDate = null;
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd-HH:mm", Locale.US);
        String datetime = date + "-" + slot.toString();
        appointmentDate = dateFormat.parse(datetime);
        SimpleDateFormat currentdateFormat = new SimpleDateFormat("yyyy-MM-dd-HH-mm-ss", Locale.US);
        currentDate = currentdateFormat.parse(current_date);
        List<Vaccine> vaccines1 = new ArrayList<>();
        for (int i = 0; i < vaccines.size(); i++) {
            vaccines1.add(vaccineRepository.findById(vaccines.get(i)).get());
        }
        Appointment appointment = new Appointment(patient_id, clinic_id, appointmentDate, slot, AppointmentStatus.BOOKED, vaccines1, currentDate);
        appointmentRepository.save(appointment);
        notificationService.sendMakeAppointment(appointment);
        return appointment;
    }


    @Transactional(rollbackOn = {IOException.class, SQLException.class})
    public Object updateAppointment(Integer appointmentId, Integer clinic_id, String date, LocalTime slot, List<Integer> vaccines) throws ParseException {
        Appointment appointment = appointmentRepository.findById(appointmentId).get();
        if (!clinic_id.equals(appointment.getClinicId())) appointment.setClinicId(clinic_id);
        Date appointmentDate = null;
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd-HH:mm", Locale.US);
        String datetime = date + "-" + slot.toString();
        appointmentDate = dateFormat.parse(datetime);
        if (!appointmentDate.equals(appointment.getDate())) appointment.setDate(appointmentDate);
        if (!slot.equals(appointment.getSlot())) appointment.setSlot(slot);
        List<Vaccine> vaccines1 = new ArrayList<>();
        for (int i = 0; i < vaccines.size(); i++) {
            vaccines1.add(vaccineRepository.findById(vaccines.get(i)).get());
        }
        appointment.setVaccines(vaccines1);
        notificationService.sendUpdatedAppointment(appointment);
        return appointment;
    }

    @Transactional(rollbackOn = {IOException.class, SQLException.class})
    public void cancelAppointment(Integer appointmentId) {
        boolean appointmentExists = appointmentRepository.existsById(appointmentId);
        if (!appointmentExists) {
            throw new IllegalStateException("Appointment with " + appointmentId + " does not exist.");
        }
        appointmentRepository.findById(appointmentId).get().setStatus(AppointmentStatus.CANCELLED);
        Appointment appointment = appointmentRepository.findById(appointmentId).get();
        notificationService.sendCancelAppointment(appointment);
    }

    @Transactional(rollbackOn = {IOException.class, SQLException.class})
    public Object getPastAppointment(Integer patient_id, String current_date) throws ParseException {
        Date cdate = null;
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd-HH-mm-ss", Locale.US);
        cdate = dateFormat.parse(current_date);
        List<Appointment> appointments = appointmentRepository.getPastAppointments(cdate, patient_id);
        List<Appointment> results = appointments;
        List<Clinic> allClinics = clinicRepository.findAll();

        final Map<Integer, String> clinicsById = allClinics.stream()
                .collect(Collectors.toMap(k -> k.getClinicId(), k -> k.getName()));

        final List<AppointmentClinic> pastAppts = appointments.stream().map( a ->
                new AppointmentClinic(a, clinicsById.get(a.getClinicId()))).collect(Collectors.toList());

        //need to handle this in front end as setter method will change DB status.
        /*
        for(int i=0;i<appointments.size();i++){
            if((appointments.get(i)).getStatus().equals("booked")){
                (results.get(i)).setStatus("No Show");
            } else if ((appointments.get(i)).getStatus().equals("Checked-In")){
                (results.get(i)).setStatus("Completed");
            }
        } */
        return pastAppts;
    }

    @Transactional(rollbackOn = {IOException.class, SQLException.class})
    public Object getFutureAppointment(Integer patient_id, String current_date) throws ParseException {
        Date cdate = null;
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd-HH-mm-ss", Locale.US);
        cdate = dateFormat.parse(current_date);
        List<Appointment> appointments = appointmentRepository.getFutureAppointments(cdate, patient_id);

        List<Appointment> futureNotCancelledAppointments = appointments.stream()
                .filter(app -> app.getStatus() != AppointmentStatus.CANCELLED).collect(Collectors.toList());

        List<Clinic> allClinics = clinicRepository.findAll();

        final Map<Integer, String> clinicsById = allClinics.stream()
                .collect(Collectors.toMap(k -> k.getClinicId(), k -> k.getName()));

        final List<AppointmentClinic> futureAppts = futureNotCancelledAppointments.stream().map( a ->
                new AppointmentClinic(a, clinicsById.get(a.getClinicId()))).collect(Collectors.toList());

        return futureAppts;
    }

    @Transactional(rollbackOn = {IOException.class, SQLException.class})
    public Object getCheckinAppointment(Integer patient_id, String current_date) throws ParseException {
        Date cdate = null;
        List<Integer> eligibleAppointments = new ArrayList<>();
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyy-MM-dd-HH-mm-ss", Locale.US);
        cdate = dateFormat.parse(current_date);
        Calendar cal = Calendar.getInstance(); // creates calendar
        cal.setTime(cdate);               // sets calendar time/date
        cal.add(Calendar.HOUR_OF_DAY, 24);      // adds 24 hour
        List<Appointment> appointments = appointmentRepository.getCheckinAppointments(cdate, cal.getTime(), patient_id);
        for(Appointment a : appointments){
            eligibleAppointments.add(a.getAppointmentId());
        }
        return eligibleAppointments;
    }

    @Transactional(rollbackOn = {IOException.class, SQLException.class})
    public Object makeCheckinAppointment(Integer patient_id, Integer appointment_id) throws ParseException {
        Appointment appointment = appointmentRepository.findById(appointment_id).get();
        appointment.setStatus(AppointmentStatus.CHECKED_IN);
        notificationService.sendCheckinAppointment(appointment);
        return appointment;
    }

    @Transactional(rollbackOn = {IOException.class, SQLException.class})
    public Object[] getDueAppointments(Integer patientId, String currentDate) throws ParseException {
        //Consider 12 months duration for due vaccinations
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd-HH-mm-ss", Locale.US);
        Date currDate = dateFormat.parse(currentDate);

        List<VaccineDueModel> vaccinationsDue = new LinkedList<>();

        List<Appointment> pastAppointments = appointmentRepository.getPastAppointments(currDate, patientId);

        List<Appointment> pastCompletedAppointments = pastAppointments.stream()
                .filter(app -> app.getStatus() == AppointmentStatus.CHECKED_IN).collect(Collectors.toList());


        HashMap<String, List<Appointment>> shotsTaken = new HashMap<>();

        for (Appointment appointment : pastCompletedAppointments) {
            for (Vaccine vaccine : appointment.getVaccines()) {
                String vaccineName = vaccine.getName();
                if (shotsTaken.containsKey(vaccineName)) shotsTaken.get(vaccineName).add(appointment);
                shotsTaken.putIfAbsent(vaccineName, new LinkedList<>(Arrays.asList(appointment)));
            }
        }


        List<Vaccine> allVaccines = vaccineRepository.findAll();

        for (Vaccine vaccine : allVaccines) {
            //Patient has taken this vaccine before
            String vaccineName = vaccine.getName();
            System.out.println(vaccineName);
            Integer vaccineShots = vaccine.getNumOfShots();
            System.out.println(vaccineShots);
            if (shotsTaken.containsKey(vaccineName)) {
                Integer pendingShots = vaccineShots - shotsTaken.get(vaccineName).size();
                System.out.println(pendingShots);
                Appointment lastAppt = shotsTaken.get(vaccineName).get(shotsTaken.get(vaccineName).size() - 1);
                System.out.println(lastAppt);

                //Total number of shots taken is less than mandatory number of doses
                if (pendingShots > 0) {
                    Date dueDate = new SimpleDateFormat("yyyy-MM-dd").parse(LocalDate.parse(lastAppt.getDate().toString().substring(0,10)).plusDays(vaccine.getDuration()).toString());
                    vaccinationsDue.add(new VaccineDueModel(vaccineName, shotsTaken.get(vaccineName).size() + 1, dueDate, vaccine.getVaccineId()));
                }

                //Total number of shots taken is equal to mandatory number of doses
                if (pendingShots == 0) {
                    if (vaccine.getDuration() != -1) {
                        long diffInMillies = Math.abs(currDate.getTime() - lastAppt.getDate().getTime());
                        long diff = TimeUnit.DAYS.convert(diffInMillies, TimeUnit.MILLISECONDS);
                        Date dueDate = new SimpleDateFormat("yyyy-MM-dd").parse(LocalDate.parse(lastAppt.getDate().toString().substring(0,10)).plusDays(vaccine.getDuration()).toString());
                        if (diff > vaccine.getDuration() && currDate.after(lastAppt.getDate()))
                            vaccinationsDue.add(new VaccineDueModel(vaccineName, shotsTaken.get(vaccineName).size() + 1, dueDate, vaccine.getVaccineId()));
                    }
                }
            } else
                vaccinationsDue.add(new VaccineDueModel(vaccineName, 1, new SimpleDateFormat("yyyy-MM-dd").parse(LocalDate.parse(LocalDate.now().toString()).toString()), vaccine.getVaccineId()));

        }

        List<Appointment> futureAppointments =  appointmentRepository.getFutureAppointments(currDate, patientId);

        //System.out.println("future size:" + futureAppointments.size());

        List<Clinic> allClinics = clinicRepository.findAll();

        final Map<Integer, String> clinicsById = allClinics.stream()
                .collect(Collectors.toMap(k -> k.getClinicId(), k -> k.getName()));

//        final Map<Integer, Appointment> appointmentsById = new HashMap<>();
//        for (Appointment k : futureAppointments) {
//            if (appointmentsById.put(k.getAppointmentId(), k) != null) {
//                throw new IllegalStateException("Duplicate key");
//            }
//        }

         List<AppointmentClinic> futureAppts = futureAppointments.stream().map( a ->
            new AppointmentClinic(a, clinicsById.get(a.getClinicId()))).collect(Collectors.toList());

        Object[] allDues = {vaccinationsDue, futureAppts};
        return allDues;
    }

    public Object getHistory(Integer patientId, String currentDate) throws ParseException {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd-HH-mm-ss", Locale.US);
        Date currDate = dateFormat.parse(currentDate);
        List<Appointment> pastAppointments = appointmentRepository.getPastAppointments(currDate, patientId);
        //System.out.println("pastAppts:"+pastAppointments.size());

        //completed means administered
        List<Appointment> pastCompletedAppointments = pastAppointments.stream()
                .filter(app -> app.getStatus() == AppointmentStatus.COMPLETED).collect(Collectors.toList());

        //System.out.println("size completed:"+pastCompletedAppointments.size());

        List<Clinic> allClinics = clinicRepository.findAll();

        final Map<Integer, String> clinicsById = allClinics.stream()
                .collect(Collectors.toMap(k -> k.getClinicId(), k -> k.getName()));

        List<AppointmentClinic> pastAppts = pastCompletedAppointments.stream().map( a ->
                new AppointmentClinic(a, clinicsById.get(a.getClinicId()))).collect(Collectors.toList());

        HashMap<String, List<AppointmentClinic>> vaccinationHistory = new HashMap<>();
        //System.out.println("hashmap size"+vaccinationHistory.size());

        for(AppointmentClinic ac : pastAppts){
            List<Vaccine> vaccinations = ac.getAppointment().getVaccines();
            for(Vaccine vaccine : vaccinations){
                String vaccineName = vaccine.getName();
                if (vaccinationHistory.containsKey(vaccineName)) vaccinationHistory.get(vaccineName).add(ac);
                vaccinationHistory.putIfAbsent(vaccineName, new LinkedList<>(Arrays.asList(ac)));
            }
        }

        return vaccinationHistory;
    }

//    public Object getHistory(Integer patientId, String currentDate) throws ParseException {
//
//        Date cdate = null;
//        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd-HH-mm-ss", Locale.US);
//        cdate = dateFormat.parse(currentDate);
//        return appointmentRepository.getApptsTest(cdate, patientId);
//    }

    public class VaccineDueModel {
        String vaccineName;
        Integer shotNumber;
        Date dueDate;
        Integer vaccineId;

        public VaccineDueModel(String vaccineName, Integer shotNumber, Date dueDate, Integer vaccineId) {
            this.vaccineName = vaccineName;
            this.shotNumber = shotNumber;
            this.dueDate = dueDate;
            this.vaccineId = vaccineId;
        }

        public Integer getVaccineId() {
            return vaccineId;
        }

        public void setVaccineId(Integer vaccineId) {
            this.vaccineId = vaccineId;
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

    public class AppointmentClinic{
       Appointment appointment;
       String clinicName;

        public AppointmentClinic(Appointment appointment, String clinicName) {
            this.appointment = appointment;
            this.clinicName = clinicName;
        }

        public Appointment getAppointment() {
            return appointment;
        }

        public void setAppointment(Appointment appointment) {
            this.appointment = appointment;
        }

        public String getClinicName() {
            return clinicName;
        }

        public void setClinicName(String clinicName) {
            this.clinicName = clinicName;
        }
    }

    @Transactional(rollbackOn = {IOException.class, SQLException.class})
    public void markAppointmentCompleted(Integer patient_id, String current_date) throws ParseException {
        List<Appointment> pastAppointments = (List<Appointment>) getPastAppointment(patient_id, current_date);
        //System.out.println("pastSize"+ pastAppointments.size());
        try{
            for (int i = 0; i < pastAppointments.size(); i++) {
                if ((pastAppointments.get(i)).getStatus().equals(AppointmentStatus.BOOKED)) {
                    (pastAppointments.get(i)).setStatus(AppointmentStatus.NO_SHOW);
                } else if ((pastAppointments.get(i)).getStatus().equals(AppointmentStatus.CHECKED_IN)) {
                    (pastAppointments.get(i)).setStatus(AppointmentStatus.COMPLETED);
                }
            }
        } catch(Exception e){
            System.out.println(e.getMessage());
        }
        return ;
    }
}
