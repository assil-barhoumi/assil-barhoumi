import type { Project } from './types'

// In display order.
export const projects: Project[] = [
  {
    slug: 'odoo-sales-automation',
    title: 'AI-Powered Sales Automation in Odoo',
    status: 'completed',
    categories: ['ai'],
    summary:
      'Two Odoo 19 modules, built at BID Consulting, that read order and supplier-invoice emails with large language models: orders become draft quotations automatically, and invoices become vendor bills once an accountant has validated them.',
    blurb:
      'Two Odoo modules that use LLMs to turn order and supplier-invoice emails into quotations and vendor bills, cutting order processing from 12 minutes to 1 in the ROI study.',
    intro:
      'During my final-year internship at BID Consulting, I built two Odoo 19 modules that read order and invoice emails with large language models and turn them into ERP records, with a person in charge wherever a mistake would be expensive. Both are deployed at the company.',
    tech: ['Python', 'Odoo 19', 'Qwen Plus', 'Kimi K3 (vision)', 'Prompt engineering', 'MLflow', 'PostgreSQL', 'Docker', 'IMAP and OAuth2', 'PyMuPDF'],
    period: 'Feb – Aug 2026',
    context: 'Final-year project, BID Consulting',
    figure: 'pipeline',
    scene: {
      src: 'images/projects/odoo-sales-automation/odoo-invoice-scene.webp',
      focus: '50% 22%',
      alt: '3D illustration of a desk: an opened envelope with a mint seal and a supplier invoice on the left; on the right, a laptop showing the invoice beside the fields read from it, with a mint approve button.',
      width: 1600,
      height: 1000,
    },
    sections: [
      {
        id: 'problem',
        title: 'The problem',
        text: [
          'BID Consulting received about 50 orders and 50 supplier invoices a month by email, in French, Arabic or English, and retyped each one into Odoo by hand. Nothing happened until someone opened the inbox, errors grew with the volume, and nothing recorded which emails had already been handled.',
        ],
      },
      {
        id: 'system',
        title: 'How it works',
        text: [
          'Two Odoo 19 modules read the company’s Gmail and Outlook mailboxes every day, skip duplicates, and send each email or invoice to a large language model that returns structured data.',
        ],
        list: [
          {
            term: 'Orders',
            text: 'Qwen Plus reads the email and its attachments (PDF, Excel, CSV), and a draft quotation is created automatically for a salesperson to price.',
          },
          {
            term: 'Invoices',
            text: 'Kimi K3, a vision model, reads each page. An accountant validates the data before any vendor bill is created, because a wrong ledger entry costs far more than a wrong quotation line.',
          },
          {
            term: 'Security',
            text: 'Passwords and API keys are encrypted, and access follows roles: sales, accounting, administrators.',
          },
        ],
        figures: [
          {
            kind: 'image',
            src: 'images/projects/odoo-sales-automation/odoo-quotation.webp',
            alt: 'Quotation S00077 in the Odoo Sales app: order lines grouped under materiel_informatique.pdf, liste_peripheriques.csv and EMAIL BODY, with a planned activity saying the customer name may be outdated.',
            width: 1600,
            height: 1090,
            caption: 'A draft quotation created from an order email, flagged for review.',
          },
          {
            kind: 'image',
            src: 'images/projects/odoo-sales-automation/odoo-invoice-review.webp',
            alt: 'Smart Invoice record in Odoo: a scanned invoice from a joinery workshop on the left, the extracted supplier details, dates, totals and line items on the right, with Validate and Reject buttons.',
            width: 1400,
            height: 1627,
            caption: 'Invoice review before the accountant’s check; here the currency was misread.',
          },
        ],
      },
      {
        id: 'results',
        title: 'Results',
        text: [
          'I chose the models with a benchmark rather than by reputation: three candidates per task, tested on 106 orders and 113 invoices in four languages, with every run tracked in MLflow. For invoices, Kimi K3 read 97.1% of fields correctly, against 86.4% and 84.2% for the other two. For orders, Qwen Plus was within a point of the most accurate candidate while using fewer than half its tokens. In the ROI study, processing time fell from 12 minutes to 1 per order and from 15 to 2 per invoice, about 240 hours a year at the current volume.',
        ],
        figures: [
          {
            kind: 'bars',
            caption: 'Time per document, manual and with the system.',
            unit: 'min',
            series: ['Manual', 'With the system'],
            rows: [
              { label: 'Order to quotation', values: [12, 1] },
              { label: 'Invoice to vendor bill', values: [15, 2] },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'road-accident-risk',
    title: 'Road Accident Risk Prediction',
    status: 'completed',
    categories: ['machine-learning', 'data-analysis'],
    summary:
      'A Kaggle notebook predicting the accident risk of road segments for the Playground Series competition "Predicting Road Accident Risk", reported in the top 12% of the leaderboard.',
    blurb:
      'Predicted the accident risk of road segments from tabular data, comparing XGBoost on hand-built features with an AutoGluon ensemble. Finished in the top 12% of the Kaggle leaderboard.',
    intro:
      'A predictive modeling notebook for Kaggle’s Playground Series (Season 5, Episode 10), “Predicting Road Accident Risk”. The task is to estimate the accident risk of road segments from tabular features, and submissions are ranked on a shared leaderboard.',
    tech: ['Python', 'XGBoost', 'AutoGluon', 'LightGBM', 'CatBoost', 'Cross-validation'],
    context: 'Kaggle Playground Series, Season 5, Episode 10',
    links: {
      notebook: 'https://www.kaggle.com/code/assil22/accidentriskprediction-top-12',
    },
    figure: 'leaderboard',
    scene: {
      src: 'images/projects/road-accident-risk/accident-risk-scene.webp',
      alt: '3D illustration of a busy, curving four-lane road seen from above at an angle: toy-like cars in every lane, a mint car in the middle, a zebra crossing, and a red car waiting on a side road that joins from below.',
      width: 1600,
      height: 1000,
    },
    sections: [
      {
        id: 'problem',
        title: 'The problem',
        text: [
          'The competition asks for a model that estimates the accident risk of road segments from tabular features describing the road and its conditions. Predictions are scored on held-out data, and every submission is ranked on a public leaderboard.',
        ],
      },
      {
        id: 'data',
        title: 'Data',
        text: ['The tabular data provided by Kaggle for Playground Series Season 5, Episode 10.'],
      },
      {
        id: 'approach',
        title: 'Approach',
        text: ['I built two solutions and compared them.'],
        list: [
          {
            term: 'Feature engineering with XGBoost',
            text: 'Interaction features built by hand, and the number of boosting rounds chosen by cross-validation.',
          },
          {
            term: 'AutoGluon',
            text: 'Automated preprocessing, hyperparameter tuning and model selection, ending in an ensemble of LightGBM, CatBoost and XGBoost.',
          },
        ],
      },
      {
        id: 'results',
        title: 'Results',
        text: ['The notebook reports a finish in the top 12% of the competition leaderboard.'],
      },
    ],
  },

  {
    slug: 'student-misconception-prediction',
    title: 'Student Misconception Prediction',
    status: 'completed',
    categories: ['machine-learning'],
    summary:
      'A deep learning model that predicts the misunderstanding behind a student’s answer, from Transformer-based embeddings of the question and the answer fed into a custom neural network.',
    blurb:
      'A deep learning model that predicts the misunderstanding behind a student’s answer, from Transformer embeddings of the question and the answer.',
    intro:
      'A deep learning project on educational data. The model reads a question together with a student’s answer and predicts the misunderstanding behind it.',
    tech: ['Python', 'Deep learning', 'Transformer embeddings', 'Feature engineering'],
    figure: 'embedding',
    scene: {
      src: 'images/projects/student-misconception-prediction/misconception-worksheet.webp',
      alt: 'Illustration of a marked fractions worksheet on a wooden desk, with a yellow pencil and an eraser: the wrong answer 3/4 + 1/4 = 4/8 is circled and crossed in red with the note “same denominator add the top only”, and 0.45 is chosen as larger than 0.5.',
      width: 1597,
      height: 985,
    },
    sections: [
      {
        id: 'problem',
        title: 'The problem',
        text: ['Given a question and a student’s answer, the model has to predict the misunderstanding behind the answer.'],
      },
      {
        id: 'approach',
        title: 'Approach',
        list: [
          {
            term: 'Preprocessing and feature engineering',
            text: 'Cleaning the question–answer pairs and building features from them.',
          },
          {
            term: 'Semantic embeddings',
            text: 'A Transformer-based model turns each question–answer pair into an embedding that captures its meaning.',
          },
          {
            term: 'Custom neural network',
            text: 'The embeddings feed a neural architecture designed for the prediction.',
          },
        ],
      },
    ],
  },

  {
    slug: 'soccer-tracking-features',
    title: 'Tactical Features from Soccer Tracking Data',
    status: 'completed',
    categories: ['data-analysis'],
    summary:
      'A Kaggle hackathon write-up, “50 Aggregated Features from SkillCorner Tracking Data”: tactical features built from match tracking data to describe performance beyond the box score.',
    blurb:
      'Fifty tactical features aggregated from SkillCorner match tracking data, written up for Kaggle’s Soccer Feature Engineering Hackathon.',
    intro:
      'A feature engineering write-up for Kaggle’s Soccer Feature Engineering Hackathon, “Turning Play-by-Play Into New Performance Attributes”. Under the title “Beyond the Box Score”, it builds 50 tactical features from SkillCorner tracking data.',
    tech: ['Python', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'Feature engineering'],
    period: 'Jul 2026',
    context: 'Kaggle Soccer Feature Engineering Hackathon',
    links: {
      writeup:
        'https://www.kaggle.com/competitions/soccer-feature-engineering-hackathon/writeups/50-aggregated-features-from-skillcorner-tracking-d',
    },
    figure: 'tracking',
    scene: {
      src: 'images/projects/soccer-tracking-features/soccer-pitch.webp',
      alt: 'Illustration of a football pitch seen from above, like a tracking-data view: blue and red players spread across the striped grass, two goalkeepers, and the ball near the right penalty area.',
      width: 1575,
      height: 998,
    },
    sections: [
      {
        id: 'problem',
        title: 'The problem',
        text: [
          'Box-score statistics count events such as shots and passes, but say little about how a team moves without the ball. The hackathon asks for new performance attributes built from match data.',
        ],
      },
      {
        id: 'data',
        title: 'Data',
        text: [
          'SkillCorner’s open data for 10 matches of the 2024/25 A-League season: tagged events, phases of play and lineups. The output is one row per team per match, with every feature a raw count, sum or duration.',
        ],
      },
      {
        id: 'features',
        title: 'The 50 features',
        text: [
          'I tested 47 ideas against the data, kept 17 feature groups and trimmed them to 50 with repeated correlation checks. A few of the findings behind them:',
        ],
        list: [
          { term: 'Pressure', text: 'Turnover risk rises from about 1% with no pressure to 19–20% under heavy pressure, in every zone of the pitch.' },
          { term: 'Defensive blocks', text: 'Forward runs go from 14.8% against a high press to 63.2% against a low block.' },
          { term: 'Transitions', text: 'Counter-attacks end in a goal at 3.5–6.4%, against about 1% for ordinary build-up.' },
          { term: 'Risky passes', text: 'Unexpected passes complete less often (70.9% against 86.2%) but carry about 9.5% more threat.' },
        ],
      },
    ],
  },

  {
    slug: 'recruitment-assistant',
    title: 'AI-Powered Recruitment Assistant',
    status: 'completed',
    categories: ['ai'],
    summary:
      'A system that uses AI agents to automate a hiring workflow: fetching CVs from email, analysing and scoring candidates, making accept or reject decisions, and sending automated replies.',
    blurb:
      'AI agents that automate a hiring workflow: reading CVs from email, scoring each candidate, deciding and sending the reply.',
    intro:
      'A system that uses AI agents to automate the first steps of hiring, from the CV arriving by email to the reply the candidate receives.',
    tech: ['AI agents', 'Email automation'],
    figure: 'agent',
    scene: {
      src: 'images/projects/recruitment-assistant/recruitment-scene.webp',
      focus: '50% 25%',
      alt: 'Rendered photo of a desk: three CVs fanned out, an open laptop showing a list of applications with statuses, a sticky note reading Shortlist, a pen and a coffee.',
      width: 1600,
      height: 1000,
    },
    sections: [
      {
        id: 'workflow',
        title: 'What it does',
        flow: [
          { title: 'Fetch CVs', text: 'Applications are collected from the email inbox.' },
          { title: 'Analyse profiles', text: 'An agent reads each CV and extracts the candidate’s profile.' },
          { title: 'Score suitability', text: 'Each candidate is scored against the role.' },
          { title: 'Decide', text: 'The system makes an accept or reject decision.' },
          { title: 'Reply', text: 'The candidate receives an automated response email.' },
        ],
      },
    ],
  },

  {
    slug: 'squares-in-squares',
    title: 'Squares in Squares: Packing Optimization',
    status: 'ongoing',
    categories: ['optimization'],
    summary:
      'My entry to Kaggle’s Squares in Squares competition: packing n unit squares into the smallest possible square, for every n from 1 to 1,000. For most n the best packing is still an open problem.',
    blurb:
      'My entry to Kaggle’s Squares in Squares: packing n unit squares into the smallest possible square, for every n up to 1,000, an open problem for most n.',
    intro:
      'A classic open problem in combinatorial geometry, turned by Kaggle into 1,000 puzzles: pack n non-overlapping unit squares into the smallest axis-aligned square. Squares may be rotated, and for most n nobody knows the optimal arrangement, so every tighter container improves on the best known. The competition runs from October 2026 to July 2027.',
    period: 'Since Oct 2026',
    context: 'Kaggle competition, Squares in Squares',
    links: {
      competition: 'https://www.kaggle.com/competitions/squares-in-squares',
    },
    figure: 'packing',
    scene: {
      src: 'images/projects/squares-in-squares/squares-tiles.webp',
      alt: '3D illustration of colourful tiles packed in a white tray, with three loose tiles beside it on a pale blue background.',
      width: 1596,
      height: 985,
    },
    sections: [
      {
        id: 'problem',
        title: 'The problem',
        text: [
          'Each puzzle gives a number n. The task is to place n unit squares, each by the coordinates of its centre and an angle of rotation, so that no two overlap and the axis-aligned square around them is as small as possible.',
          'For most values of n the optimal packing is unknown. The best-known solutions come from decades of work by mathematicians, computer scientists and puzzle enthusiasts, and only a handful have been proved optimal; the rest can still be improved.',
        ],
      },
      {
        id: 'scoring',
        title: 'How it is scored',
        text: [
          'Each puzzle scores L / √n − 1, where L is the side of the container and √n is the side that n unit squares would need with no gaps at all. Lower is better, and the leaderboard adds up all 1,000 puzzles. A puzzle left out is charged the score of the plain grid packing.',
        ],
      },
    ],
  },
]

