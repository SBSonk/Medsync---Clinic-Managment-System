from flask_sqlalchemy import SQLAlchemy
import models
from randomuser import RandomUser
from random import choice
from dateutil.parser import parse


people = []
def populate_people(db):
    session = db.session
    for _ in range(10):
        user = RandomUser()
        random_person = models.Person(
            first_name = user.get_first_name(),
            last_name = user.get_last_name(),
            gender = random_gender(),
            date_of_birth = parse(user.get_dob()).date(),
            contact_no = user.get_phone(),
            address = f"{user.get_street()}, {user.get_city()}, {user.get_country()}"
        )

        session.add(random_person)
        session.commit()

def random_gender():
    return choice(list(models.Gender)) 