
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field

from .database import Base, engine, get_db
from . import models, schemas
from .claimtrace import analyze_content


app = FastAPI(
    title="VERITY",
    description="Evidence-Backed Brand Governance Platform",
    version="1.0.0"
)

# Create database tables
Base.metadata.create_all(bind=engine)


class ContentSubmission(BaseModel):
    content: str = Field(..., min_length=5)


@app.get("/")
def home():
    return {
        "message": "VERITY backend is running!",
        "status": "active"
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}


# Create a brand fact
@app.post("/brand-facts", response_model=schemas.BrandFactResponse)
def create_brand_fact(
    fact: schemas.BrandFactCreate,
    db: Session = Depends(get_db)
):
    new_fact = models.BrandFact(
        **fact.model_dump(exclude={"is_approved"}),
        is_approved=False
    )

    db.add(new_fact)
    db.commit()
    db.refresh(new_fact)

    return new_fact


# View all brand facts
@app.get("/brand-facts", response_model=list[schemas.BrandFactResponse])
def get_brand_facts(db: Session = Depends(get_db)):
    return db.query(models.BrandFact).all()


# View one brand fact
@app.get("/brand-facts/{fact_id}", response_model=schemas.BrandFactResponse)
def get_brand_fact(fact_id: int, db: Session = Depends(get_db)):
    fact = db.query(models.BrandFact).filter(
        models.BrandFact.id == fact_id
    ).first()

    if fact is None:
        raise HTTPException(status_code=404, detail="Brand fact not found")

    return fact


# Approve a brand fact
@app.patch("/brand-facts/{fact_id}/approve")
def approve_brand_fact(fact_id: int, db: Session = Depends(get_db)):
    fact = db.query(models.BrandFact).filter(
        models.BrandFact.id == fact_id
    ).first()

    if fact is None:
        raise HTTPException(status_code=404, detail="Brand fact not found")

    fact.is_approved = True
    db.commit()

    return {
        "message": "Brand fact approved successfully",
        "id": fact.id
    }


# Delete a brand fact
@app.delete("/brand-facts/{fact_id}")
def delete_brand_fact(fact_id: int, db: Session = Depends(get_db)):
    fact = db.query(models.BrandFact).filter(
        models.BrandFact.id == fact_id
    ).first()

    if fact is None:
        raise HTTPException(status_code=404, detail="Brand fact not found")

    db.delete(fact)
    db.commit()

    return {"message": "Brand fact deleted successfully"}


# Analyze submitted marketing content
@app.post("/analyze")
def analyze_brand_content(
    submission: ContentSubmission,
    db: Session = Depends(get_db)
):
    approved_facts = db.query(models.BrandFact).filter(
        models.BrandFact.is_approved == True
    ).all()

    findings = analyze_content(
        submission.content,
        approved_facts
    )

    return {
        "platform": "VERITY",
        "analysis_status": "completed",
        "submitted_content": submission.content,
        "total_findings": len(findings),
        "findings": findings
    }
