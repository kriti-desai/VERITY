import os
import tempfile

from fastapi.responses import FileResponse
from starlette.background import BackgroundTask
from .report_generator import generate_verification_report
from reportlab.lib.pagesizes import A4
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle
)
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.units import inch
from xml.sax.saxutils import escape
from datetime import datetime


def generate_verification_report(analysis, output_path):

    document = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40
    )

    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        "ReportTitle",
        parent=styles["Title"],
        alignment=TA_CENTER,
        textColor=colors.HexColor("#172554"),
        fontSize=22,
        spaceAfter=8
    )

    heading_style = ParagraphStyle(
        "SectionHeading",
        parent=styles["Heading2"],
        textColor=colors.HexColor("#1D4ED8"),
        spaceBefore=16,
        spaceAfter=8
    )

    normal_style = styles["BodyText"]

    story = []

    story.append(Paragraph("VERITY", title_style))
    story.append(
        Paragraph(
            "Evidence-Backed Brand Verification Report",
            ParagraphStyle(
                "Subtitle",
                parent=normal_style,
                alignment=TA_CENTER
            )
        )
    )

    story.append(Spacer(1, 12))

    story.append(
        Paragraph(
            "Generated: " + datetime.now().strftime("%d %B %Y, %I:%M %p"),
            normal_style
        )
    )

    story.append(Spacer(1, 15))

    story.append(
        Paragraph("Submitted Marketing Content", heading_style)
    )

    story.append(
        Paragraph(
            escape(str(analysis.get("submitted_content", ""))),
            normal_style
        )
    )

    story.append(
        Paragraph("Analysis Summary", heading_style)
    )

    summary_data = [
        ["Platform", "VERITY"],
        ["Analysis Status", str(analysis.get("analysis_status", "Completed"))],
        ["Total Findings", str(analysis.get("total_findings", 0))]
    ]

    summary_table = Table(summary_data, colWidths=[150, 330])

    summary_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#DBEAFE")),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
        ("PADDING", (0, 0), (-1, -1), 8),
        ("VALIGN", (0, 0), (-1, -1), "TOP")
    ]))

    story.append(summary_table)

    for index, finding in enumerate(
        analysis.get("findings", []),
        start=1
    ):

        story.append(
            Paragraph(
                f"Finding {index}: {escape(str(finding.get('status', 'Unknown')))}",
                heading_style
            )
        )

        finding_data = [
            ["Field", "Details"],
            ["Claim", str(finding.get("claim") or "Not available")],
            ["Status", str(finding.get("status") or "Not available")],
            ["Approved Evidence", str(finding.get("approved_fact") or "Not available")],
            ["Brand Fact ID", str(finding.get("brand_fact_id") or "Not available")],
            ["Source Name", str(finding.get("source_name") or finding.get("source") or "Not available")],
            ["Source Reference", str(finding.get("source_reference") or "Not available")],
            ["Source Version", str(finding.get("source_version") or "Not available")],
            ["Effective Date", str(finding.get("effective_date") or "Not available")],
            ["Expiry Date", str(finding.get("expiry_date") or "Not available")],
            ["Evidence Status", str(finding.get("evidence_status") or "Not available")],
            ["Reason", str(finding.get("reason") or "Not available")],
            ["Recommendation", str(finding.get("recommendation") or "Not available")]
        ]

        safe_data = [
            [
                Paragraph(escape(str(cell)), normal_style)
                for cell in row
            ]
            for row in finding_data
        ]

        finding_table = Table(
            safe_data,
            colWidths=[150, 330]
        )

        finding_table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#E0E7FF")),
            ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
            ("PADDING", (0, 0), (-1, -1), 7),
            ("VALIGN", (0, 0), (-1, -1), "TOP")
        ]))

        story.append(finding_table)
        story.append(Spacer(1, 12))

    story.append(Spacer(1, 20))

    story.append(
        Paragraph(
            "VERITY provides evidence-based claim analysis. "
            "A finding reflects the available approved evidence "
            "and should be reviewed before making final decisions.",
            normal_style
        )
    )

    document.build(story)
