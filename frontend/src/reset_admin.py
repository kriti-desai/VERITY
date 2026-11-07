
from getpass import getpass
from sqlalchemy.orm import sessionmaker
from pwdlib import PasswordHash

from backend.app.database import engine
from backend.app import models

Session = sessionmaker(bind=engine)
db = Session()

try:
    admin = db.query(models.User).filter(
        models.User.username == "verityadmin"
    ).first()

    if not admin:
        print("Admin account not found.")
    else:
        new_password = getpass("Enter your new admin password: ")
        confirm_password = getpass("Confirm your new password: ")

        if len(new_password) < 8:
            print("Password must have at least 8 characters.")
        elif new_password != confirm_password:
            print("Passwords do not match.")
        else:
            admin.password_hash = PasswordHash.recommended().hash(
                new_password
            )
            db.commit()
            print("Admin password reset successfully!")

finally:
    db.close()
