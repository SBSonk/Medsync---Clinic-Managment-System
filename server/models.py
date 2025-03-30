import enum
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from sqlalchemy import ForeignKey, Enum, Date, DateTime, Numeric
from sqlalchemy.orm import Mapped, mapped_column, relationship

import datetime

db = SQLAlchemy()
bcrypt = Bcrypt()

class Gender(enum.Enum):
    MALE = "Male"
    FEMALE = "Female"
    NON_BINARY = "Non-Binary"
    OTHER = "Other"

class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(db.String(255), nullable=False, unique=True)
    password: Mapped[str] = mapped_column(db.String(255), nullable=False)
    role: Mapped[str] = mapped_column(db.String(50), nullable=False)

    person_id: Mapped[int] = mapped_column(ForeignKey('person.id'))

    def set_password(self, password: str):
        self.password = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password: str):
        return bcrypt.check_password_hash(self.password, password)
    
    def __init__(self, username: str, password: str, role: str, person_id: int):
        self.username = username
        self.set_password(password)
        self.role = role
        self.person_id = person_id
        

class Person(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    first_name: Mapped[str] = mapped_column(db.String(50), nullable=False)
    last_name: Mapped[str] = mapped_column(db.String(50), nullable=False)
    gender: Mapped[Enum] = mapped_column(Enum(Gender), nullable=False)
    date_of_birth: Mapped[datetime.date] = mapped_column(Date, nullable=False)
    contact_no: Mapped[str] = mapped_column(db.String(31), nullable=False)
    address: Mapped[str] = mapped_column(db.String(255), nullable=False)


class Patient(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    height: Mapped[float] = mapped_column(Numeric(3, 2), nullable=False)
    weight: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
    blood_type: Mapped[str] = mapped_column(db.String(3))
    allergies: Mapped[str] = mapped_column(db.String(255))
    medical_history: Mapped[str] = mapped_column(db.String(255))
    family_history: Mapped[str] = mapped_column(db.String(255))

    person_id: Mapped[int] = mapped_column(ForeignKey('person.id'), nullable=False)
    emergency_contact_id: Mapped[int] = mapped_column(ForeignKey('emergency_contact.patient_id'), nullable=False)
    next_appointment_id: Mapped[int] = mapped_column(ForeignKey('appointment.id'))

class EmergencyContact(db.Model):
    __tablename__ = 'emergency_contact'
    patient_id: Mapped[int] = mapped_column(ForeignKey('patient.id'), primary_key=True)
    person_id: Mapped[int] = mapped_column(ForeignKey('person.id'), nullable=False)
    relation: Mapped[str] = mapped_column(db.String(16), nullable=False)

class Appointment(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    type: Mapped[str] = mapped_column(db.String(30), nullable=False)
    patient_id: Mapped[int] = mapped_column(ForeignKey('patient.id'), nullable=False)
    doctor_id: Mapped[int] = mapped_column(ForeignKey('employee.id'), nullable=False)
    date_time: Mapped[datetime.datetime] = mapped_column(DateTime, nullable=False)
    status: Mapped[str] = mapped_column(db.String(10), nullable=False)
    note: Mapped[str] = mapped_column(db.String(255), nullable=False)

class Employee(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    person_id: Mapped[int] = mapped_column(ForeignKey('person.id'), nullable=False)
    occupation: Mapped[str] = mapped_column(db.String(50), nullable=False)
    department: Mapped[str] = mapped_column(db.String(50), nullable=False)

    shift_id: Mapped[int] = mapped_column(ForeignKey('employee_shift.employee_id'), nullable=False)

class EmployeeShift(db.Model):
    __tablename__ = 'employee_shift'

    employee_id: Mapped[int] = mapped_column(ForeignKey('employee.id'), primary_key=True)
    schedule: Mapped[str] = mapped_column(db.String(255), nullable=False)

class Inventory(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    batch_id: Mapped[str] = mapped_column(db.String(8), nullable=False)
    name: Mapped[str] = mapped_column(db.String(50), nullable=False)
    type: Mapped[str] = mapped_column(db.String(30), nullable=False)
    quantity: Mapped[int] = mapped_column(nullable=False)
    expiration_date: Mapped[datetime.date] = mapped_column(Date, nullable=False)
    supplier: Mapped[str] = mapped_column(db.String(50), nullable=False)
    supplier_contact: Mapped[str] = mapped_column(db.String(31), nullable=False)