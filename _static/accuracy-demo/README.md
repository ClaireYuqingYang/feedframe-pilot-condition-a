# Accuracy+ UI demo

## October main-study update

The integrated banners now follow FF_Main_Study_Banners_Oct_2026.qsf: all three interventions share the blue background (#e8f0fe), blue border (#2563eb), centered text, and blue uppercase heading. Accuracy goals include all five updated options. Control has no banner.

New sessions use DICE/static/data/main_study_demo.csv with four supplied pilot headlines in this fixed order: HuffPost (marmot meat), The Economist (psychedelic tourism), Daily Mail (teacher), and BBC (plane). No quality labels appear in the UI. Dates and nonzero initial engagement counts are presentation placeholders, not observed engagement. Counts are fixed per post, not randomized on each page load. Demo sessions configured with this CSV reload the current stimuli when the feed renders; other sessions retain their stored data.

BBC and Economist logos reuse local assets. HuffPost and Daily Mail use supplied square logos with circular masks. Article preview images and logos are served locally. The X-style feed retains empty side columns and displays a centered X above the tabs. The Current events tab and Reminder banner label avoid naming the manipulation. Demo settings remain available in the lower-right corner; H hides or restores them when not typing.

Condition A's DICE/C_Feed.html now includes T_Accuracy_Goals.html and loads demo.js with scoped dice.css. The original DICE posts and reaction controls remain. oTree demo sessions skip introduction and briefing pages. The feed is presentation-only: timers, dwell/scroll tracking, and form submission are disabled. oTree still creates its normal session and participant records; this is not a production data-collection configuration.

The earlier standalone index.html is retained as a design reference. Use the oTree Demo entry to preview the integrated UI.

The September goal-setting QSF supplies the exact QID4 accuracy choices, QID5 sharing goals, QID7 plan choices, and their embedded-data short forms. The October accuracy-importance QSF supplies the five importance choices, personalized reminder, and five sample headlines. Copies of both QSFs and the working manuscript are in the project-level reference_materials/accuracy_plus_2026 directory.

Use the version selector to demonstrate Accuracy+, Accuracy+ Plan, or Accuracy Importance. The selector is a presentation control, not randomized assignment. Other-goal and plan options support custom text. Like/repost/share/reply actions change in-memory UI only. Start over clears all demo state. Publisher names are displayed as typographic avatars; post images are intentionally omitted.

In the integrated DICE page, the bottom-right Demo settings panel includes all four conditions: Control (no banner), Accuracy Importance, Accuracy+, and Accuracy+ Plan. Goal editing is also in this panel. Hide for screenshot hides the whole panel; H restores or hides it when not typing or editing goals. The FeedFrame title and Interactive demo label are removed from the feed header. These are presentation controls only, not a participant-facing condition selector for an experiment.

The integrated DICE page was checked at desktop and 390px mobile widths. Goal selection, plan selection, personalized importance reminders, and the existing like action were exercised in the browser. JavaScript syntax and source-file copies were also checked locally.
