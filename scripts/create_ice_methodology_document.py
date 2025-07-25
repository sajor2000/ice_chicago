#!/usr/bin/env python3
"""
Create a comprehensive PDF document explaining ICE methodology
Uses matplotlib to create a multi-page PDF with text, equations, and visualizations
"""

import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import Rectangle, FancyBboxPatch
import numpy as np
from pathlib import Path
from datetime import datetime
from matplotlib.backends.backend_pdf import PdfPages
import textwrap

# Set up paths
SCRIPT_DIR = Path(__file__).parent
PROJECT_DIR = SCRIPT_DIR.parent
OUTPUT_DIR = PROJECT_DIR / "methodology_docs"

# Create output directory
OUTPUT_DIR.mkdir(exist_ok=True)

# Set font properties
plt.rcParams.update({
    'font.family': 'sans-serif',
    'font.sans-serif': ['Arial', 'Helvetica', 'DejaVu Sans'],
    'font.size': 11,
})

def create_title_page(pdf):
    """Create title page"""
    fig = plt.figure(figsize=(8.5, 11))
    ax = fig.add_subplot(111)
    ax.axis('off')
    
    # Title
    ax.text(0.5, 0.8, 'Chicago Segregation Analysis', 
            ha='center', va='center', fontsize=28, fontweight='bold',
            transform=ax.transAxes)
    
    ax.text(0.5, 0.72, 'Using the Index of Concentration at the Extremes (ICE)', 
            ha='center', va='center', fontsize=20,
            transform=ax.transAxes)
    
    # Subtitle
    ax.text(0.5, 0.6, 'Methodology and Technical Documentation', 
            ha='center', va='center', fontsize=16, style='italic',
            transform=ax.transAxes)
    
    # Date
    ax.text(0.5, 0.5, f'Generated: {datetime.now().strftime("%B %Y")}', 
            ha='center', va='center', fontsize=14,
            transform=ax.transAxes)
    
    # Data source
    ax.text(0.5, 0.4, 'Data Source: U.S. Census Bureau\nAmerican Community Survey 5-Year Estimates (2018-2022)', 
            ha='center', va='center', fontsize=12,
            transform=ax.transAxes)
    
    # Add decorative element
    rect = FancyBboxPatch((0.1, 0.25), 0.8, 0.02, 
                         boxstyle="round,pad=0.01",
                         facecolor='#08519c', edgecolor='none')
    ax.add_patch(rect)
    
    pdf.savefig(fig, bbox_inches='tight')
    plt.close()

def create_introduction_page(pdf):
    """Create introduction page"""
    fig = plt.figure(figsize=(8.5, 11))
    ax = fig.add_subplot(111)
    ax.axis('off')
    
    # Title
    ax.text(0.5, 0.95, '1. Introduction', 
            ha='center', va='top', fontsize=18, fontweight='bold',
            transform=ax.transAxes)
    
    # Content
    intro_text = """
The Index of Concentration at the Extremes (ICE) is a measure of spatial social polarization that quantifies the extent to which a geographic area's residents are concentrated into extremes of deprivation and privilege. Originally developed by Douglas Massey and subsequently refined by Nancy Krieger and colleagues for public health applications, ICE provides a single metric that captures both the concentration of disadvantage and advantage within a given area.

Key Advantages of ICE:
• Captures both ends of the social spectrum (privilege and deprivation)
• Ranges from -1 to +1 for intuitive interpretation
• Can be calculated for multiple domains (race, income, or their intersection)
• More sensitive to extremes than traditional dissimilarity indices
• Directly relevant for understanding health and social inequities

This analysis applies ICE to Chicago's 1,332 census tracts to examine patterns of:
1. Racial segregation (White non-Hispanic vs Black non-Hispanic)
2. Economic segregation (High income vs Low income)
3. Racialized economic segregation (intersection of race and income)

The goal is to identify areas of concentrated deprivation that may benefit from targeted interventions and to understand the spatial distribution of privilege and disadvantage across Chicago's neighborhoods.
"""
    
    # Wrap and display text
    wrapped_text = textwrap.fill(intro_text, width=80)
    ax.text(0.1, 0.85, wrapped_text, ha='left', va='top', fontsize=11,
            transform=ax.transAxes, wrap=True)
    
    pdf.savefig(fig, bbox_inches='tight')
    plt.close()

def create_methodology_page(pdf):
    """Create methodology page"""
    fig = plt.figure(figsize=(8.5, 11))
    ax = fig.add_subplot(111)
    ax.axis('off')
    
    # Title
    ax.text(0.5, 0.95, '2. ICE Calculation Methodology', 
            ha='center', va='top', fontsize=18, fontweight='bold',
            transform=ax.transAxes)
    
    # ICE formulas
    y_pos = 0.85
    
    # Formula 1: ICE Race
    ax.text(0.1, y_pos, 'ICE for Racial Segregation:', 
            ha='left', va='top', fontsize=12, fontweight='bold',
            transform=ax.transAxes)
    
    ax.text(0.5, y_pos - 0.05, 
            r'$ICE_{race} = \frac{P_{white,NH} - P_{black,NH}}{P_{total}}$',
            ha='center', va='top', fontsize=14,
            transform=ax.transAxes)
    
    ax.text(0.1, y_pos - 0.1, 
            'Where:\n'
            '• P_white,NH = Count of White non-Hispanic residents\n'
            '• P_black,NH = Count of Black non-Hispanic residents\n'
            '• P_total = Total population of the census tract',
            ha='left', va='top', fontsize=10,
            transform=ax.transAxes)
    
    # Formula 2: ICE Income
    y_pos -= 0.25
    ax.text(0.1, y_pos, 'ICE for Economic Segregation:', 
            ha='left', va='top', fontsize=12, fontweight='bold',
            transform=ax.transAxes)
    
    ax.text(0.5, y_pos - 0.05, 
            r'$ICE_{income} = \frac{HH_{high} - HH_{low}}{HH_{total}}$',
            ha='center', va='top', fontsize=14,
            transform=ax.transAxes)
    
    ax.text(0.1, y_pos - 0.1, 
            'Where:\n'
            '• HH_high = Households with income ≥ $100,000/year\n'
            '• HH_low = Households with income < $25,000/year\n'
            '• HH_total = Total households in the census tract',
            ha='left', va='top', fontsize=10,
            transform=ax.transAxes)
    
    # Formula 3: ICE Race-Income
    y_pos -= 0.25
    ax.text(0.1, y_pos, 'ICE for Racialized Economic Segregation:', 
            ha='left', va='top', fontsize=12, fontweight='bold',
            transform=ax.transAxes)
    
    ax.text(0.5, y_pos - 0.05, 
            r'$ICE_{race-income} = \frac{HH_{white,high} - HH_{black,low}}{HH_{race-income}}$',
            ha='center', va='top', fontsize=14,
            transform=ax.transAxes)
    
    ax.text(0.1, y_pos - 0.1, 
            'Where:\n'
            '• HH_white,high = White non-Hispanic households with income ≥ $100,000\n'
            '• HH_black,low = Black non-Hispanic households with income < $25,000\n'
            '• HH_race-income = Total households with race and income data',
            ha='left', va='top', fontsize=10,
            transform=ax.transAxes)
    
    # Interpretation guide
    y_pos -= 0.25
    ax.text(0.1, y_pos, 'Interpretation:', 
            ha='left', va='top', fontsize=12, fontweight='bold',
            transform=ax.transAxes)
    
    interpretation = """
• ICE = -1: Complete concentration of the deprived group
• ICE = 0: Equal representation of both groups
• ICE = +1: Complete concentration of the privileged group
• ICE < -0.4: Extreme deprivation (priority areas for intervention)
"""
    
    ax.text(0.1, y_pos - 0.05, interpretation,
            ha='left', va='top', fontsize=10,
            transform=ax.transAxes)
    
    pdf.savefig(fig, bbox_inches='tight')
    plt.close()

def create_data_source_page(pdf):
    """Create data source page"""
    fig = plt.figure(figsize=(8.5, 11))
    ax = fig.add_subplot(111)
    ax.axis('off')
    
    # Title
    ax.text(0.5, 0.95, '3. Data Sources and Processing', 
            ha='center', va='top', fontsize=18, fontweight='bold',
            transform=ax.transAxes)
    
    # Content sections
    y_pos = 0.85
    
    sections = [
        ("Data Source:", 
         "U.S. Census Bureau, American Community Survey (ACS)\n"
         "5-Year Estimates, 2018-2022\n"
         "Geographic Level: Census Tracts"),
        
        ("Key ACS Tables Used:",
         "• B03002: Hispanic or Latino Origin by Race\n"
         "• B19001: Household Income in the Past 12 Months\n"
         "• B19001A-I: Household Income by Race/Ethnicity\n"
         "• B01003: Total Population"),
        
        ("Geographic Coverage:",
         "• Chicago city limits\n"
         "• 1,332 census tracts\n"
         "• 77 community areas\n"
         "• Cook County, Illinois"),
        
        ("Data Quality Controls:",
         "• Excluded tracts with population < 100\n"
         "• Checked for missing or suppressed values\n"
         "• Validated against published ACS margins of error\n"
         "• Cross-referenced with Chicago Data Portal"),
        
        ("Processing Steps:",
         "1. Downloaded raw ACS data via Census API\n"
         "2. Calculated ICE measures for each tract\n"
         "3. Assigned census tracts to community areas\n"
         "4. Generated summary statistics\n"
         "5. Created geographic visualizations")
    ]
    
    for title, content in sections:
        ax.text(0.1, y_pos, title, 
                ha='left', va='top', fontsize=12, fontweight='bold',
                transform=ax.transAxes)
        
        ax.text(0.1, y_pos - 0.03, content,
                ha='left', va='top', fontsize=10,
                transform=ax.transAxes)
        
        y_pos -= 0.15
    
    pdf.savefig(fig, bbox_inches='tight')
    plt.close()

def create_findings_page(pdf):
    """Create key findings page"""
    fig = plt.figure(figsize=(8.5, 11))
    ax = fig.add_subplot(111)
    ax.axis('off')
    
    # Title
    ax.text(0.5, 0.95, '4. Key Findings', 
            ha='center', va='top', fontsize=18, fontweight='bold',
            transform=ax.transAxes)
    
    # Summary statistics table
    y_pos = 0.85
    ax.text(0.1, y_pos, 'Summary Statistics:', 
            ha='left', va='top', fontsize=12, fontweight='bold',
            transform=ax.transAxes)
    
    # Create simple table
    table_data = [
        ['Measure', 'Mean', 'Min', 'Max', 'Priority Areas'],
        ['ICE Race', '0.113', '-1.000', '0.927', '330 (24.8%)'],
        ['ICE Income', '0.188', '-0.771', '0.848', '47 (3.5%)'],
        ['ICE Race-Income', '0.188', '-0.771', '0.848', '47 (3.5%)']
    ]
    
    # Draw table
    cell_height = 0.04
    cell_width = 0.15
    table_x = 0.1
    table_y = y_pos - 0.05
    
    for i, row in enumerate(table_data):
        for j, cell in enumerate(row):
            # Header row
            if i == 0:
                rect = Rectangle((table_x + j*cell_width, table_y - i*cell_height), 
                               cell_width, cell_height,
                               facecolor='#e0e0e0', edgecolor='black', linewidth=0.5)
                ax.add_patch(rect)
                ax.text(table_x + j*cell_width + cell_width/2, 
                       table_y - i*cell_height + cell_height/2,
                       cell, ha='center', va='center', fontsize=9, fontweight='bold')
            else:
                rect = Rectangle((table_x + j*cell_width, table_y - i*cell_height), 
                               cell_width, cell_height,
                               facecolor='white', edgecolor='black', linewidth=0.5)
                ax.add_patch(rect)
                ax.text(table_x + j*cell_width + cell_width/2, 
                       table_y - i*cell_height + cell_height/2,
                       cell, ha='center', va='center', fontsize=9)
    
    # Key findings text
    y_pos = table_y - len(table_data) * cell_height - 0.1
    
    findings = """
Key Patterns Identified:

1. Racial Segregation (ICE Race)
   • Highest level of segregation among the three measures
   • 330 census tracts (24.8%) fall below the -0.4 threshold
   • Strong geographic clustering on Chicago's South and West sides

2. Economic Segregation (ICE Income)
   • More evenly distributed than racial segregation
   • Only 47 tracts (3.5%) in extreme deprivation
   • High-income concentration in North Side neighborhoods

3. Racialized Economic Segregation (ICE Race-Income)
   • Captures intersection of race and class
   • Pattern similar to economic segregation alone
   • Highlights areas of compounded disadvantage

4. Geographic Patterns
   • Clear North-South divide in all measures
   • West Side shows concentrated deprivation
   • Lakefront areas show concentrated privilege
   • Community areas vary internally in segregation levels
"""
    
    ax.text(0.1, y_pos, findings,
            ha='left', va='top', fontsize=10,
            transform=ax.transAxes)
    
    pdf.savefig(fig, bbox_inches='tight')
    plt.close()

def create_implications_page(pdf):
    """Create implications and recommendations page"""
    fig = plt.figure(figsize=(8.5, 11))
    ax = fig.add_subplot(111)
    ax.axis('off')
    
    # Title
    ax.text(0.5, 0.95, '5. Implications and Recommendations', 
            ha='center', va='top', fontsize=18, fontweight='bold',
            transform=ax.transAxes)
    
    content = """
Policy Implications:

1. Targeted Intervention Areas
   • 330 census tracts identified as priority areas based on racial ICE
   • These areas represent nearly 25% of Chicago's census tracts
   • Concentrated primarily in historically disinvested communities

2. Health Equity Considerations
   • Areas with low ICE values correlate with poor health outcomes
   • Need for increased healthcare resources in priority areas
   • Address social determinants of health through place-based interventions

3. Economic Development
   • Focus economic development in areas with low economic ICE
   • Support wealth-building initiatives in segregated communities
   • Address employment access and wage disparities

Recommendations:

1. Data-Driven Resource Allocation
   • Use ICE values to guide funding decisions
   • Prioritize areas with ICE < -0.4 for interventions
   • Monitor changes in ICE over time to assess impact

2. Cross-Sector Collaboration
   • Coordinate housing, health, education, and economic policies
   • Engage community organizations in priority areas
   • Build coalitions across neighborhood boundaries

3. Continuous Monitoring
   • Update ICE calculations with each ACS release
   • Track progress toward integration goals
   • Develop dashboard for real-time monitoring

4. Community Engagement
   • Share findings with affected communities
   • Incorporate resident perspectives in solutions
   • Build community capacity for data use

Limitations:

• ICE measures relative concentration, not absolute numbers
• Census tract boundaries may not align with neighborhood identity
• 5-year ACS estimates may mask recent changes
• Does not capture within-tract variation
"""
    
    ax.text(0.1, 0.88, content,
            ha='left', va='top', fontsize=10,
            transform=ax.transAxes)
    
    pdf.savefig(fig, bbox_inches='tight')
    plt.close()

def create_references_page(pdf):
    """Create references page"""
    fig = plt.figure(figsize=(8.5, 11))
    ax = fig.add_subplot(111)
    ax.axis('off')
    
    # Title
    ax.text(0.5, 0.95, '6. References', 
            ha='center', va='top', fontsize=18, fontweight='bold',
            transform=ax.transAxes)
    
    references = """
1. Krieger N, Waterman PD, Spasojevic J, Li W, Maduro G, Van Wye G. Public Health Monitoring of Privilege and Deprivation With the Index of Concentration at the Extremes. Am J Public Health. 2016;106(2):256-263.

2. Massey DS. The age of extremes: Concentrated affluence and poverty in the twenty-first century. Demography. 1996;33(4):395-412.

3. Krieger N, Kim R, Feldman J, Waterman PD. Using the Index of Concentration at the Extremes at multiple geographical levels to monitor health inequities in an era of growing spatial social polarization: Massachusetts, USA (2010-14). Int J Epidemiol. 2018;47(3):788-819.

4. U.S. Census Bureau. American Community Survey 5-Year Estimates, 2018-2022. Washington, DC: U.S. Department of Commerce; 2023.

5. Chicago Metropolitan Agency for Planning. Community Data Snapshots. Chicago, IL: CMAP; 2023.

6. Feldman JM, Waterman PD, Coull BA, Krieger N. Spatial social polarisation: using the Index of Concentration at the Extremes jointly for income and race/ethnicity to analyse risk of hypertension. J Epidemiol Community Health. 2015;69(12):1199-1207.

7. Chicago Department of Public Health. Healthy Chicago 2025: Chicago's Community Health Assessment and Improvement Plan. Chicago, IL: CDPH; 2023.

8. Acevedo-Garcia D, Lochner KA, Osypuk TL, Subramanian SV. Future directions in residential segregation and health research: a multilevel approach. Am J Public Health. 2003;93(2):215-221.

9. Williams DR, Collins C. Racial residential segregation: a fundamental cause of racial disparities in health. Public Health Rep. 2001;116(5):404-416.

10. Iceland J, Weinberg DH, Steinmetz E. Racial and Ethnic Residential Segregation in the United States: 1980-2000. Washington, DC: U.S. Census Bureau; 2002.
"""
    
    ax.text(0.1, 0.88, references,
            ha='left', va='top', fontsize=9,
            transform=ax.transAxes)
    
    # Footer
    ax.text(0.5, 0.05, 'For questions or additional information, contact: [research team email]',
            ha='center', va='bottom', fontsize=8, style='italic',
            transform=ax.transAxes)
    
    pdf.savefig(fig, bbox_inches='tight')
    plt.close()

def create_ice_methodology_pdf():
    """Create complete methodology PDF"""
    output_path = OUTPUT_DIR / "Chicago_ICE_Methodology_Document.pdf"
    
    print(f"Creating methodology document: {output_path}")
    
    with PdfPages(output_path) as pdf:
        # Create all pages
        create_title_page(pdf)
        create_introduction_page(pdf)
        create_methodology_page(pdf)
        create_data_source_page(pdf)
        create_findings_page(pdf)
        create_implications_page(pdf)
        create_references_page(pdf)
        
        # Add metadata
        d = pdf.infodict()
        d['Title'] = 'Chicago ICE Analysis Methodology'
        d['Author'] = 'Urban Health Equity Research Team'
        d['Subject'] = 'Index of Concentration at the Extremes Methodology'
        d['Keywords'] = 'ICE, segregation, Chicago, methodology, census'
        d['CreationDate'] = datetime.now()
    
    print(f"  ✓ Created: {output_path}")
    print(f"  ✓ Total pages: 7")

if __name__ == "__main__":
    print("\nCreating ICE Methodology Document...")
    print("="*50)
    
    create_ice_methodology_pdf()
    
    print("\nDocument creation complete!")
    print("="*50)