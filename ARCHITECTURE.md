Company name:Bitopi group
Departments:    HR & Admin,
                Industrial Engineering,
                CAD & Sample,
                Commercial,
                Engineering & Services,
                ERP & IT,
                Finance & Accounts,
                General,
                HR, Admin & Compliance,
                MIS & Internal Audit,
                Production,
                Production Planning & control ,
                QA, Audit & Technical,
                Store & Warehouse,
                Technical,
                Washing,
                Design & Product Development,
                ESG,
                Marketing & Merchandising,
                Supply Chain,
                IE
UI design style: modern supabase dashboard style minimalistic but user friendly.
Font : use inter as fpmt
Card button : hover effect with magnetic hover effect

1. Define KPIs	KPI Setup includes ID, Department, KRA, MO, SMART KPI, Perspective, Weight, Threshold, Requirements, HIGH/LOW, Unit, Baseline and Target. Up to 60 KPI slots.
2. Weights	Enter weights as percentages ,emn system koro jate user mon vule 100% er beshi weight vag kore dite na pare,dite chaile validation dekhabe. Each department must total 100%. Dashboard flags incorrect totals. Sample: two KPIs per department, each 50%.
3. Units	Baseline and Target are numeric values. For percentages enter 90% or 0.9; days are durations, currency is numeric BDT. Apply the appropriate cell number format when changing units; dropdown alone does not change Excel formatting.
4. Monthly entry	Each department enters one row per KPI/year/month: Achievement, status, remarks and optional monthly target override. Jan/Feb are illustrative; Mar-Dec are Pending. 600 entry rows provided. Do not duplicate KPI/year/month rows.
5. Input availability	Workload Adjusted requires eligible input available early enough to complete by the deadline. Effective target = MIN(monthly target, eligible input). Use only with management approval. Fixed policy uses the original target.
6. No input vs zero	No Input is excluded as N/A only when the dependency is outside the employee’s responsibility. Reported + zero delivery against positive eligible work = 0%. Pending is excluded until reported. Document late input in Remarks/RCA.
7. Calculation	HIGH = Achievement / Effective Target. LOW = Effective Target / Achievement. Score = MIN(5, Performance * 5). Threshold 4/4.5/5 is interpreted as a minimum score out of 5 (80%/90%/100%). Confirm this interpretation before business use.
8. Zero handling	LOW with zero achievement gets 100% and score 5. LOW target 0: actual 0 gets 100%; positive actual gets 0%. HIGH effective target <=0 is N/A. Values must be non-negative. Negative metrics require a separate rule.
9. Dashboard	Change Year and Month on Dashboard. Weighted performance and score use only valid scored KPI weights. Coverage = scored weight / assigned department weight. A high score with low coverage does not mean all departmental work was evaluated.
10. Action plans	Use separate rows with the same KPI ID for multiple numbered steps. Each step has owner, requirements, due date, status and remarks. {action plan dashboard e progressbar system e dekhabe}
11. Baseline & annual review	Baseline is a reference, not the scoring denominator. Review prior-year eligible workload, actual performance, capacity, seasonality and approved improvement when setting next-year targets. No-input months need documented treatment.
12. Formulas & editing	Monthly formula cells are protected without a password to avoid accidental overwrites. Inputs remain editable. Review > Unprotect Sheet allows structural changes. Dashboard and setup remain editable. Excel recalculates automatically.
13. Extend or customize	New departments: update Lists and Dashboard. Beyond 60 KPIs or 600 monthly rows: extend dropdown source ranges, formulas and dashboard ranges. Workbook contains no macros or external links.


User Type: Super admin,
           Employees

UI flow: super admin jokhon login korbe tokhon puro department er kpi overview dekhte parbe based on performace{% ,weight and threshold} ekhane ekta chuto ? mark thakbe why it is important.

3 ta tab thakbe Overview,KPI board,Action plan

Overview: e yearly monthly er summary

KPI board er sequence {
ID,KRA,MO(Major Objective),KPI(SMART),Perspective{4 ta dropdown{Process,Account,Learning&Development,Customer}},Weight{Distribution your work based on 100%},Threshold{dropdown 4,4.5,5},Action plan{multiple steps for a single KPI},Responsible person{Action plan onushare},Requirements{},High or Low{higher is better or lower is better },Baseline(number,%,Day,currency),Target(number,%,Day,currency),performance month{protita dept month wise monthly not yearly performance boshabe then dashboard e performance update hobe ,ei part er ui ta toggle hobe (->) e click korle puro ta dekhabe}
}
jokhon kew add kpi e click korbe then ekta card view ashbe khub simple step progressbar shoho {
     1. first card e KRA r MO entry dite parbe{One entry at a time,no multiple KRA or MO in a field}
     2. second process e KPI er field ashbe with 2 tab{kew direct KPI boshai dite pare as a plain text ekta tab e},{naile 2nd tab e 5 ta field diba{Specific goal(S){Text},Measure(M){text area},Achievable(A){Yes/No},Relevant(R){Yes/NO},Time(T){text area}}} then dashboard auto value boshai nibe
     3. Action plan e default 3 ta text field thakbe. then (+) e click kore new action r responsible person add kora jabe ..eita ekta important part..
     4. then ekta field e Add requirements er option chole ashbe
     5. next process e weight{dropdown},threshold{dropdown} ashbe
     6. next process e shobar upore |High|Low| checkbox type button thakbe for which is better ,baseline select korbe based on {day,percent,currency,unit,number},target select korbe based on {day,percent,currency,unit,number} 
     7. next process e achievement set korar jonno 2 ta input field lagbe dropdown menu top e jekhane month select kora jabe month select kore ekta value boshai dibe{day,percent,currency,unit,number}..
     [NB: card er value dile dashboard e KPI table e puro data load hoiye jabe for 1 full KPI..each cell editable hobe r click korle ekta card open hobe value edit korar jonno{like ami january te value boshaite chai table er cell e click korle exact oi cell er jonno value set kore dite parbo} ]    

     user just input dibe monthly but main performance dasboard kintu dekhbe admin..

}

niche dan pashe ekta robo face thakbe manush confused thakle ok question korbe KPI related oi answer dibe or JSONL dataset theke..history rakhbe local browser storage e.
......................................................
Project er jonno Memory file update korbe always
Security md file update korbe always

----------------------------------------------------------------
           ()
         (   )
        (avatar) Mr Admin
         (    )  Dept:
           ()    Designation:
---------------------------------------------------------------|
    Overview    |  KPI board   |  Action plan                  |
---------------------------------------------------------------|
|____________________KPI Dashboard_____________________________|
|  (+)Add KPI
________________________________________________________________
|_______________________________________________________________
|
|
|--------------------------------------------------------------


sample ekta KPI tracker er architecture banaw 

 
