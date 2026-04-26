'use client';

import { useState, useEffect } from "react";
import { BookOpen, Bookmark, NotebookPen, Settings, Flame, ChevronLeft, Check, Lock, ArrowRight, Sparkles, Target, Crown, Coins, Compass, Flame as FireIcon, User, Edit2 } from "lucide-react";
import { createClient } from '../lib/supabase';
import { loadUserData, saveProfile, unlockDay, completeDay, saveStreak, saveNote as saveNoteDB, toggleBookmarkDB } from '../lib/db';


/* ============ CONSTANTS ============ */

const COLORS = {
  navy: "#0F1B2D",
  navyDeep: "#091322",
  charcoal: "#1A2238",
  charcoalLight: "#222C45",
  gold: "#C9A961",
  goldSoft: "#D4B870",
  goldDim: "#8C7440",
  cream: "#F5F1E8",
  muted: "#8B92A8",
  border: "#2A3450",
  borderSoft: "#1F2942",
};

const USER_TYPES = [
  { id: "entrepreneur", label: "Entrepreneur", desc: "Multiple ventures, always building" },
  { id: "executive", label: "Executive", desc: "Leading at scale" },
  { id: "creative", label: "Creative", desc: "Building through craft and storytelling" },
];

const READING_PATHS = [
  {
    id: "thematic",
    name: "The Builder's Path",
    tagline: "Scripture organized around what you actually face as a builder.",
    description: "Built around the challenges every builder faces: Vision, Leadership, Money, Faith Under Pressure, and Wisdom. Drawn from across the whole Bible. Best if you want depth on the topics that shape how you lead, decide, and build.",
    daysApprox: 600,
  },
  {
    id: "chronological",
    name: "Chronological",
    tagline: "The Bible in the order events actually happened.",
    description: "The Bible was not written in chronological order. This path rebuilds the timeline so you experience the story as it unfolded -- creation, the patriarchs, the kings, the exile, Christ, the early church. Best if context, history, and story flow matter to you.",
    daysApprox: 365,
  },
  {
    id: "book_by_book",
    name: "Book by Book",
    tagline: "Each book of the Bible, start to finish, with depth.",
    description: "Move through one book at a time -- understanding its author, audience, and message before moving to the next. Slower, more thorough. Best if you want to genuinely know each book rather than skim across many.",
    daysApprox: 1189,
  },
];

const PACES = [
  {
    id: "five_per_week",
    name: "5 days a week",
    desc: "Steady rhythm. Weekends free for rest and reflection.",
    multiplier: 1.4,
  },
  {
    id: "one_per_day",
    name: "One a day",
    desc: "Every single day. Maximum consistency, fastest completion.",
    multiplier: 1.0,
  },
  {
    id: "two_per_week",
    name: "Two longer sessions",
    desc: "Two deeper sessions weekly. Built for very busy weeks.",
    multiplier: 3.5,
  },
];

const THEMATIC_TRACKS = [
  { id: "vision", name: "Vision & Purpose", desc: "Why you were built to build." },
  { id: "leadership", name: "Leadership & Authority", desc: "Leading people well." },
  { id: "money", name: "Money & Stewardship", desc: "What scripture really says about wealth." },
  { id: "pressure", name: "Faith Under Pressure", desc: "Trusting God when things break." },
  { id: "wisdom", name: "Wisdom & Decision Making", desc: "Discernment, counsel, timing." },
];

/* ============ ENTRIES ============ */

const ENTRIES = {
  chronological: [
    {
      id: "chrono-1",
      day: 1,
      reading: "Genesis 1 (NIV)",
      hook: "Before anything existed, only God did. Watch how He builds.",
      contextPreview: "Genesis was traditionally attributed to Moses around 1400 BC, written for a people who had just walked out of Egyptian slavery and needed to know who their God was...",
      context: "Genesis was traditionally attributed to Moses around 1400 BC, written for a people who had just walked out of Egyptian slavery and needed to know who their God was, where they came from, and why they mattered. Chapter 1 opens with the most foundational claim in scripture: God spoke, and reality came into being. Every other religion of the time had gods who fought, manipulated, or were limited by matter. Israel's God simply spoke.",
      principlePreview: "God brings order out of chaos through intentional, deliberate creation...",
      principle: "God brings order out of chaos through intentional, deliberate creation. Each step builds on the last. Light before plants. Land before animals. The order matters. The Hebrew word bara (created) is reserved for God alone -- humans make from material; only He creates from nothing.",
      deepDive: "Notice the rhythm: God speaks, it happens, He sees it is good. Six times He pauses to evaluate His own work before continuing. He does not rush. He does not skip steps. And after creating humanity, He blesses them and gives them authority over what He has made. The pattern is speak, act, evaluate, bless, repeat.",
      application: "Building a company from nothing is a faint echo of what God did with the universe. Three takeaways for how you build: One, speak before you build. Vision precedes action. Two, pause to evaluate. Do not just produce; assess. Three, bless what you build. Take genuine pride in good work without slipping into arrogance. Founders who skip evaluation burn out fast. Founders who never feel proud of their work also burn out -- just slower.",
      question: "What are you building right now without first speaking a clear vision over it? And when was the last time you paused to evaluate -- not just outputs, but whether what you are building is actually good?",
      prayer: "Father, You spoke and the universe answered. Help me speak vision over my work today, build with intention, and pause long enough to see whether what I am making is truly good. Amen.",
    },
    {
      id: "chrono-2",
      day: 2,
      reading: "Genesis 2 (NIV)",
      hook: "God plants a garden, then asks a man to name everything in it.",
      contextPreview: "Chapter 2 zooms in. The wide-angle creation account in chapter 1 narrows to focus on one man, one place...",
      context: "Chapter 2 zooms in. The wide-angle creation account in chapter 1 narrows to focus on one man, one place, one assignment. God forms Adam from the dust, breathes life into him, and gives him a job: work the garden, take care of it, and name the animals. This is humanity's first task -- and it is creative, responsible, and meaningful. Work existed before sin did.",
      principlePreview: "Work is not a curse -- it is one of the first gifts God gave...",
      principle: "Work is not a curse -- it is one of the first gifts God gave. Adam was placed in paradise and immediately given responsibility. The garden needed tending, the animals needed naming. God did not make humanity to lounge; He made us to build, cultivate, and lead.",
      deepDive: "Notice that God did not name the animals Himself. He brought them to Adam to see what he would call them. That is delegation at the highest level. The Creator of the universe steps back and gives the human creative authority over what He just made. Adam's first day on the job involved language, observation, and judgment. Then God notices something is not good -- Adam is alone -- and creates Eve. Even in paradise, working alone was not the design.",
      application: "Two principles for builders. First, your work is sacred -- not because of what you produce, but because the act of creating well reflects the One who made you. Stop separating spiritual life from work life. Second, you are not meant to build alone. Adam in paradise still needed a partner. If you are doing everything yourself, you are not being noble; you are being disobedient to design. Find your Eve -- a partner, a team, a co-builder.",
      question: "Are you treating your work as sacred or just as a transaction? And where in your business are you trying to do alone what was designed to be done with others?",
      prayer: "God, You worked before You rested, and You called Your work good. Help me see my own work as something more than output. Show me where I am isolated and need partnership. Amen.",
    },
    {
      id: "chrono-3",
      day: 3,
      reading: "Genesis 3 (NIV)",
      hook: "Everything was perfect. Then someone asked, did God really say...",
      contextPreview: "Chapter 3 explains how everything broke. The serpent does not start by attacking God's existence; he attacks God's words...",
      context: "Chapter 3 explains how everything broke. The serpent does not start by attacking God's existence; he attacks God's words. Did God really say you cannot eat from any tree? That is not what God said -- God only restricted one tree. But the seed of doubt was planted. Eve adds to the command, then breaks it. Adam, standing right there the entire time, says nothing. They eat. Everything changes.",
      principlePreview: "The first attack on humanity was not violence -- it was distortion of God's word...",
      principle: "The first attack on humanity was not violence -- it was a distortion of God's word. Notice the strategy: question what God said, exaggerate the restriction, then promise that disobedience leads to enlightenment. Sin almost always starts with a slight twist of the truth, not a complete lie.",
      deepDive: "Adam's silence is one of the most damning leadership failures in scripture. He was there. He heard the conversation. He chose passivity over protection. When God comes looking for them, Adam blames Eve and indirectly blames God -- the woman You gave me. Eve blames the serpent. No one takes ownership. The consequences are immediate: shame, broken relationships, hard labor, separation from God. But notice the grace -- God still clothes them before sending them out.",
      application: "Three brutal lessons for leaders. One, watch how you handle truth. Slight distortions are how integrity collapses, not dramatic lies. Two, silence is a decision. When something is wrong in your business, your team, your partnerships -- and you say nothing -- you are participating. Three, blame breaks teams faster than failure does. The willingness to say I own this, even when others contributed, is rare and powerful.",
      question: "Where in your work have you stayed silent when you knew you should have spoken? And what is the small distortion of truth -- told to yourself or others -- that is slowly costing you?",
      prayer: "Lord, give me courage to speak when silence is easier. Show me where I have shaded the truth and call me back to honesty. Even when I have failed, You still clothe me. Thank You. Amen.",
    },
  ],
  book_by_book: [
    {
      id: "book-1",
      day: 1,
      reading: "Proverbs 1 (NIV)",
      hook: "Solomon opens the book with a warning -- and an invitation to a different kind of life.",
      contextPreview: "Proverbs is mostly written by Solomon, who became king around 970 BC and was famously the wisest man who ever lived...",
      context: "Proverbs is mostly written by Solomon, who became king around 970 BC and was famously the wisest man who ever lived. He wrote this book partly as a father teaching his son how to navigate the world. Chapter 1 is the introduction -- it lays out why wisdom matters, who it is for, and what happens to those who reject it.",
      principlePreview: "The fear of the Lord is the beginning of knowledge -- meaning real wisdom starts with...",
      principle: "The fear of the Lord is the beginning of knowledge -- meaning real wisdom starts with humility before God, not intelligence or experience. Fools, in this book, are not stupid people. They are people who have rejected correction. That distinction changes everything.",
      deepDive: "Solomon contrasts two voices throughout the chapter: wisdom calling out in the streets, and the seductive pull of crowds that promise quick gain through corruption. Verses 10-19 are a masterclass on how compromise begins -- with a group, a promise of easy reward, and a small step in the wrong direction. The chapter ends with wisdom saying: I called and you refused, so when disaster comes, do not be surprised.",
      application: "For the entrepreneur, this chapter is a survival manual. One, surround yourself carefully -- the people who invite you into shortcuts will not be there when the shortcuts catch up to you. Two, learn to love correction. Most founders surround themselves with yes-people; the wise ones build feedback systems. Three, wisdom is not just smart decisions; it is rooted in reverence. Without God at the center, even good strategy decays into self-serving hustle.",
      question: "Who in your life is allowed to correct you -- not just give input, but actually push back? If no one comes to mind, that is a problem worth fixing this week.",
      prayer: "God, give me a hunger for wisdom that runs deeper than my hunger for success. Surround me with people who tell me the truth. Make my fear of You the foundation of every decision. Amen.",
    },
    {
      id: "book-2",
      day: 2,
      reading: "Proverbs 2 (NIV)",
      hook: "Wisdom is not given to those who casually want it. It is given to those who hunt for it.",
      contextPreview: "Chapter 2 is one long sentence in the original Hebrew -- a single, sustained argument about how wisdom is actually obtained...",
      context: "Chapter 2 is one long sentence in the original Hebrew -- a single, sustained argument about how wisdom is actually obtained. Solomon uses urgent verbs: accept, store up, turn your ear, apply your heart, call out, cry aloud, look for it, search for it. This is not casual study. This is treasure hunting.",
      principlePreview: "Wisdom protects you from two specific dangers: corrupt men and seductive paths...",
      principle: "Wisdom protects you from two specific dangers Solomon names directly: corrupt men whose ways are crooked, and seductive paths that look attractive but lead to death. Wisdom is not just about making good choices -- it is about recognizing the difference between paths that lead to life and paths that lead nowhere.",
      deepDive: "The chapter structure is conditional: if you do these things (verses 1-4), then these results follow (verses 5-22). The if is heavy -- accept, store up, turn your ear, apply your heart, call out, cry aloud. Wisdom is not passive. The result is twofold: you will understand the fear of the Lord, and you will be protected from destructive influences. Notice that wisdom does not just make you smarter -- it changes who you are drawn to and who is drawn to you.",
      application: "Most people consume content about wisdom; few hunt for it. There is a difference between scrolling business advice and actually digging into a difficult passage of scripture or sitting with a hard truth until it changes you. Two practical moves: First, build a regular practice of pursuing wisdom -- not just consuming it. Slow reading, journaling, asking deeper questions. Second, audit who and what is shaping your thinking. Wisdom protects you from corrupt influences, but only if you have done the work to recognize them.",
      question: "Are you actually hunting for wisdom or just casually consuming content about it? What would change if you treated wisdom like buried treasure this month?",
      prayer: "Father, I confess I often want wisdom without working for it. Give me hunger to search, dig, and persist. Protect me from paths that look right but lead away from You. Amen.",
    },
    {
      id: "book-3",
      day: 3,
      reading: "Proverbs 3 (NIV)",
      hook: "Two of the most quoted verses in the Bible sit in this chapter -- and most people miss the surrounding context.",
      contextPreview: "Proverbs 3:5-6 is on coffee mugs everywhere, but in context the chapter is much more demanding...",
      context: "Proverbs 3:5-6 is on coffee mugs everywhere, but in context the chapter is much more demanding than the soft-focus version most people quote. Solomon is laying out a complete framework for the wise life: trust, honor God with your wealth, accept His discipline, value wisdom over riches, treat your neighbor justly, and avoid envying violent people who seem to be winning.",
      principlePreview: "Trusting God is not passive -- it is an active choice to lean away from your own understanding...",
      principle: "Trusting God is not passive -- it is an active choice to lean away from your own understanding even when your understanding seems perfectly logical. Solomon does not say your understanding is wrong; he says it is incomplete. Trusting God means making space for what you cannot yet see.",
      deepDive: "Verses 9-10 are radical for any entrepreneur: honor God with the firstfruits of your wealth, and your barns will be filled. The principle is firstfruits -- not leftovers. In the ancient world, you did not give from what you had after living comfortably; you gave the first portion before knowing how the rest of the year would go. That is trust in financial form. Verses 27-32 then turn outward: do not withhold good from those who deserve it, do not say come back tomorrow when you can help today, do not envy violent people whose ways are crooked.",
      application: "Three brutal applications. One, on decisions: trust does not mean ignoring your judgment; it means submitting your judgment to God's. Pray about big decisions before strategizing them. Two, on money: firstfruits giving is one of the hardest disciplines for entrepreneurs because cash flow is unpredictable. But the principle remains -- give from the top, not the bottom. Three, on people: do not withhold good when it is in your power to act. The number of doors you can open for others is one of the truest measures of your character.",
      question: "Where is your judgment leading the decision and your prayer following? Try reversing the order this week.",
      prayer: "Lord, I confess I lean on my own understanding more than I lean on You. Teach me to trust You first, give You first, and serve others without delay. Amen.",
    },
  ],
  thematic: [
    {
      id: "thematic-vision-1",
      day: 1,
      track: "vision",
      trackName: "Vision & Purpose",
      reading: "Genesis 1-2 (NIV)",
      hook: "Before anything existed, God built. These two chapters don't just explain creation, they reshape how you see everything you're building.",
      contextPreview: "These opening chapters aren't just about how the world began, they define who you are and why your life has direction...",
      context: "These opening chapters don't just explain how the world began, they establish a foundation for identity and purpose. In a world full of noise, comparison, and pressure to perform, Genesis brings things back to something simple and grounding. Everything begins with intention. Nothing is random, nothing is accidental. God speaks, and reality responds. There is no chaos in His process, no uncertainty in His design. That same intentionality carries into humanity. You were not placed here without direction. Your life was meant to carry meaning, responsibility, and purpose from the very beginning.",
      principlePreview: "You were not made to simply consume life, but to shape and steward what's been placed in your hands...",
      principle: "You were not made to simply consume life, but to shape and steward what has been placed in your hands. In Genesis 1, humanity is given responsibility over creation. Not ownership, but stewardship. A call to care for, develop, and bring order to what exists. Then in Genesis 2, we see that work shows up before anything is broken. Before struggle, before pressure, before anything goes wrong, there is meaningful responsibility. That means work itself is not a punishment. It is part of your design. The desire you feel to build something, improve something, or create something meaningful is not random. It reflects the nature of the One who made you.",
      deepDive: "If you read Genesis 1 closely, you begin to notice a rhythm. God speaks, something happens, and then He pauses to evaluate it before moving forward. That pattern repeats again and again. Nothing is rushed, and nothing is careless. Structure is established before growth begins. Light is created before life depends on it. There is a clear sense of order that makes everything else possible. Then in Genesis 2, the story becomes more personal. God forms Adam, breathes life into him, and places him in a garden with a clear responsibility to work it and take care of it. What stands out is that God invites Adam into the process. He brings the animals to him and allows Adam to name them. The Creator of everything chooses to share creative authority. Then God makes another observation. It is not good for Adam to be alone. Even in a perfect environment, isolation was not part of the design. You were made to build, but never meant to build in isolation.",
      application: "Let this shape how you move today. First, take your creativity seriously. When you bring order to something, solve a problem, or build something meaningful, you are reflecting the nature of God. That is not something to overlook. Second, pay attention to your pace. God did not rush through creation, even though He could have. He paused to evaluate each phase before moving forward. Most people skip that step because they are focused on momentum. Take time today to step back and honestly ask whether what you are building is actually good, not just productive. Third, reconsider how you are building. If you are trying to carry everything on your own, that is not strength, it is misalignment. Identify where you need support, partnership, or accountability, and take one step toward that this week.",
      question: "What are you currently building that you have not taken the time to evaluate deeply? And who should be part of that process with you?",
      prayer: "God, You created with clarity, intention, and patience. Help me approach what I am building in the same way. Give me the discipline to pause and evaluate, the wisdom to build what is actually good, and the humility to not do it alone. Amen.",
    },
    {
      id: "thematic-vision-2",
      day: 2,
      track: "vision",
      trackName: "Vision & Purpose",
      reading: "Jeremiah 29 (NIV)",
      hook: "A letter written to people who lost everything. What God says to them will surprise you.",
      contextPreview: "Jeremiah 29 is a letter written to people in exile -- stripped of their homeland, their temple, their normal life...",
      context: "Jeremiah 29 is a letter written to people in exile. They had been taken from everything familiar -- their land, their community, their way of life -- and relocated to a foreign place they never chose. Some were waiting for a quick rescue. Some were bitter. Some had stopped planning altogether because nothing felt permanent. Into that situation, God sends a letter through Jeremiah with a message that cuts against every natural instinct. Stop waiting to be saved. Build. Plant. Marry. Invest. Settle in. Because I have not forgotten you, and I have a plan -- but it will take longer than you want.",
      principlePreview: "The vision God has for your life does not pause because your circumstances are hard...",
      principle: "The vision God has for your life does not pause because your circumstances are hard. Jeremiah 29:11 is one of the most quoted verses in the Bible, but most people lift it out of context and miss what makes it powerful. God is not speaking to people who are comfortable. He is speaking to people in one of the lowest seasons of their lives. And His instruction is not to wait -- it is to build. The promise of a future and a hope is given to people who are actively planting, building, and seeking God in the middle of difficulty. Vision does not wait for perfect conditions.",
      deepDive: "The letter in Jeremiah 29 opens with a practical list of instructions. Build houses. Plant gardens. Get married. Have children. Seek the peace and prosperity of the city where you are. Pray for it. This was radical. These people were not in their home. They were in a foreign empire that had destroyed everything they loved. And God was telling them to invest in it. To contribute to it. To pray for it. Not because it was good, but because their flourishing was tied to showing up fully wherever they were placed. Then comes the promise in verse 11. But notice what follows. You will seek me and find me when you seek me with all your heart. The future and hope God promises is not passive. It is found by people who are actively seeking, building, and trusting in a season they did not choose.",
      application: "Three things to take into your week. First, stop waiting for the right season to build. If you are holding back on a decision, a hire, a launch, or a commitment because the timing does not feel right, read this chapter again. God told exiles to plant gardens. You can take the next step. Second, invest fully in where you are. Whether that is a city, a company, a relationship, or a season of life you did not plan for -- half-commitment produces half-results. Show up fully to what is in front of you. Third, seek God specifically and intentionally. Verse 13 does not say He will be found by people who are vaguely spiritual. It says those who seek Him with all their heart. That is a standard worth taking seriously.",
      question: "What season are you currently in that you have been waiting to get through instead of fully building in? What would it look like to plant a garden right where you are?",
      prayer: "God, You have plans for me that go beyond what I can see right now. Help me stop waiting for better conditions and start building in the ones I have. Show me what it means to seek You with all my heart in this specific season. Amen.",
    },
    {
      id: "thematic-vision-3",
      day: 3,
      track: "vision",
      trackName: "Vision & Purpose",
      reading: "Habakkuk 2 (NIV)",
      hook: "A frustrated prophet asks God why He seems silent. The answer changes everything about how vision works.",
      contextPreview: "Habakkuk opens the book by arguing with God. He is not gentle about it. He wants to know why injustice seems to be winning...",
      context: "Habakkuk opens this book by arguing with God. He is not gentle about it. He wants to know why injustice seems to be winning and why God appears to be doing nothing. By chapter 2, God responds -- and what He says is not a full explanation. It is an instruction. Write the vision down. Make it plain. Wait for it. It is coming. This is not the answer Habakkuk was expecting. But it is the answer that matters most for anyone who has ever felt like the thing they are working toward is taking far too long.",
      principlePreview: "A vision that lives only in your head is a vision that is already fading...",
      principle: "A vision that lives only in your head is a vision that is already fading. God tells Habakkuk to write the vision and make it plain on tablets -- so clear that someone running past could read it. That is not a poetic instruction. It is a practical one. Clarity is not optional when it comes to vision. Vague direction produces vague results. And the second part of this chapter is just as important as the first. Though the vision linger, wait for it. Vision and timing are not the same thing. Knowing where you are going and knowing when you will arrive are two different conversations.",
      deepDive: "Chapter 2 begins with Habakkuk taking a posture of waiting and listening. He stations himself and watches to see what God will say. That posture matters. Most people bring God their plans and ask for approval. Habakkuk positions himself to actually hear. Then God speaks and the instruction is layered. Write it. Make it plain. Wait for it. It will not prove false. Then the chapter shifts into a series of woes against those who build through exploitation, greed, and corruption. The contrast is deliberate. There is a way to pursue vision that is rooted in integrity and trust, and there is a way that is rooted in taking from others to get ahead. One endures. The other collapses under its own weight. The chapter ends with one of the most powerful lines in the entire book -- the Lord is in His holy temple, let all the earth be silent before Him.",
      application: "Two things to do this week. First, write your vision down. Not a business plan, not a strategy doc -- one clear paragraph that describes what you are building and why it matters. Make it plain enough that someone who has never met you could read it and understand it. If you cannot do that, the vision is not clear enough yet. Second, separate vision from timeline. If you are frustrated because something is taking longer than expected, ask yourself whether you are losing faith in the vision itself or just in your preferred timeline. Those are different problems with different solutions.",
      question: "Have you written your vision down clearly enough that someone else could carry it? And are you confusing a delay in timing with a problem in the vision itself?",
      prayer: "God, give me clarity about what I am building and why. Help me write it plainly, hold it patiently, and trust that what You have shown me will come at the right time. Teach me the difference between waiting in faith and waiting in fear. Amen.",
    },
    {
      id: "thematic-vision-4",
      day: 4,
      track: "vision",
      trackName: "Vision & Purpose",
      reading: "Isaiah 43-44 (NIV)",
      hook: "God speaks directly to people stuck in the past. What He says next is one of the boldest statements in scripture.",
      contextPreview: "Isaiah 43 and 44 are addressed to people who are carrying the weight of what has already happened...",
      context: "Isaiah 43 and 44 are addressed to people who are carrying the weight of what has already happened. Past failures, past losses, past seasons that did not go the way they were supposed to. God opens chapter 43 with something that cuts straight through all of it. Do not fear, for I have redeemed you. I have called you by name, you are mine. Then He says something that should stop every person who has been living in the rearview mirror. Forget the former things. Do not dwell on the past. I am doing a new thing. Now it springs up -- do you not perceive it?",
      principlePreview: "You cannot build toward a new vision while anchored to an old identity...",
      principle: "You cannot build toward a new vision while anchored to an old identity. Isaiah 43 and 44 make a direct case for releasing what was in order to receive what is coming. This is not toxic positivity or denial. God acknowledges the past -- He references Egypt, He references the wilderness, He references the hard seasons. But He does not let His people stay there. The new thing He is doing requires eyes that are looking forward. Chapter 44 reinforces this by reminding the reader of who God is -- the first and the last, the one who formed them before they were born. The vision for your life did not begin when you started paying attention to it.",
      deepDive: "Isaiah 43 opens with the word but -- which is doing enormous work. Everything that came before, all the difficulty and failure and loss, is being contrasted with something new. God reminds His people that He has been with them through water and fire. He is not a distant observer. Then He says something surprising. He calls them His witnesses -- people whose lives testify to who God is. That is a vision worth building toward. Not just success, not just scale, but a life that points to something beyond itself. Chapter 44 then shifts into a powerful declaration against idolatry -- the practice of building something with your own hands and then bowing down to it. The warning is direct. When what you are building becomes what you worship, you have lost the plot.",
      application: "Two questions worth sitting with today. First, what are you still carrying from a past season that is making it harder to move into what God is doing now? Not to dismiss it, but to name it clearly and decide whether you are going to keep letting it define your direction. Second, what are you building right now that might be drifting toward becoming an idol? Not because ambition is wrong, but because when the thing you are building becomes more important than the One who called you to build it, something has gone off course.",
      question: "What from your past are you still dwelling on that is making it harder to perceive the new thing God is doing? And is what you are building pointing to God or replacing Him?",
      prayer: "God, You are doing something new. Help me perceive it. Loosen my grip on what has already happened and give me eyes to see what You are building now. Keep me from making my work into something I worship. Let my life point to You. Amen.",
    },
    {
      id: "thematic-vision-5",
      day: 5,
      track: "vision",
      trackName: "Vision & Purpose",
      reading: "Proverbs 19-20 (NIV)",
      hook: "Two chapters packed with observations about how humans plan, decide, and deceive themselves.",
      contextPreview: "Proverbs 19 and 20 are not a single narrative -- they are a collection of observations about human nature...",
      context: "Proverbs 19 and 20 are not a single narrative. They are a collection of direct, unfiltered observations about how humans actually operate -- how we plan, how we deceive ourselves, how we make decisions, and what gets in the way of wisdom. There is no softening here. Proverbs does not flatter its reader. It tells the truth about what it looks like when people operate from ego, impatience, and self-deception, and then sets that against what is possible when someone chooses wisdom, integrity, and genuine counsel.",
      principlePreview: "Many plans form in a human heart, but the purpose of the Lord -- that is what prevails...",
      principle: "Many plans form in a human heart, but the purpose of the Lord is what prevails. Proverbs 19:21 is one of the most honest things in scripture about the relationship between human ambition and divine direction. It does not say your plans are wrong. It does not say stop planning. It says understand the difference between your agenda and God's purpose -- and build your life around the latter. Chapter 20 reinforces this with a sobering observation. Who can say I have kept my heart pure? The honest answer is no one. Which means humility is not optional for anyone who wants to build with integrity.",
      deepDive: "Proverbs 19 covers a wide range of human failures -- the danger of acting without knowledge, the problem of false witnesses, the weight of a parent's heartbreak over a foolish child. But threaded through all of it is a consistent theme. Self-awareness is rare and valuable. The person who knows their own limitations, who listens before speaking, who does not rush a decision because of impatience -- that person is positioned differently than most. Chapter 20 then takes it further. It warns against the seduction of easy money, the danger of gossip, the false confidence of someone who has not actually examined their own motives. Verse 5 is particularly striking. The purposes of a human heart are deep waters, but a person of understanding draws them out. Vision requires you to know yourself honestly.",
      application: "Three takeaways for this week. First, hold your plans loosely. Not because they do not matter, but because the version of your plan that God refines is always better than the version you started with. Stay committed to the direction while remaining open to the details changing. Second, slow down on decisions that feel urgent. Proverbs 19 and 20 return again and again to the cost of haste. Most bad decisions are fast decisions made under pressure. Build the habit of creating space before committing. Third, get honest about your motives. Chapter 20 asks who can say their heart is pure. You cannot lead well or build well if you are operating from motives you have never examined.",
      question: "What plan are you currently holding so tightly that you would resist God redirecting it? And what decision are you about to make quickly that deserves more time?",
      prayer: "God, You know the plans in my heart better than I do. Align them with Your purpose. Slow me down when I am moving from impatience. Give me the self-awareness to examine my own motives honestly, and the humility to let Your direction override mine. Amen.",
    },
    {
      id: "thematic-vision-6",
      day: 6,
      track: "vision",
      trackName: "Vision & Purpose",
      reading: "Ephesians 1-2 (NIV)",
      hook: "You were chosen before the foundation of the world. Read that again.",
      contextPreview: "Ephesians 1 and 2 are some of the most identity-forming chapters in the entire New Testament...",
      context: "Ephesians 1 and 2 are some of the most identity-forming chapters in the entire New Testament. Paul is writing to a church in Ephesus -- a wealthy, cosmopolitan city full of people who measured worth by status, influence, and achievement. Into that environment, Paul opens with one of the most stunning declarations in scripture. Before the foundation of the world, God chose you. Not based on your performance. Not based on your potential. Before any of it existed, you were already in the plan.",
      principlePreview: "Your purpose was not something you discovered -- it was something that was already prepared for you...",
      principle: "Your purpose was not something you discovered -- it was something prepared in advance for you to walk in. Ephesians 2:10 says it directly. You are God's handiwork, created in Christ Jesus to do good works, which God prepared in advance for you to do. That word handiwork in the original Greek is poema -- the same root as the English word poem. You are not a product. You are not a project. You are a work of art with a specific, intentional purpose that was written before you were born.",
      deepDive: "Ephesians 1 opens with a cascade of identity statements. Chosen. Adopted. Redeemed. Forgiven. Sealed. These are not things you earned -- they are things that were decided before you could do anything to influence them. Paul then prays that the readers would know the hope to which they have been called and the incomparably great power available to them. Most people live far below what is available to them spiritually because they have never internalized who they actually are. Chapter 2 then makes the contrast sharp. Before Christ, dead in sin, following the patterns of a broken world. After Christ, raised up, seated in heavenly places, created for good works. The shift is total. The old identity does not get renovated -- it gets replaced.",
      application: "Two things to sit with today. First, let the word poema land. You are not a random collection of experiences and choices. You are a crafted work with specific design and purpose. That does not mean life will be easy or clear -- but it means you are not here by accident. Let that truth change how you carry yourself today. Second, identify the gap between who God says you are and who you are actually showing up as. Most of us are living from a smaller identity than what scripture assigns us. Not out of rebellion, but out of habit. What would change today if you actually believed you were chosen, adopted, and created for works that were prepared specifically for you?",
      question: "What would change about how you work, lead, and build today if you fully believed you were created as a deliberate work of art with a specific purpose prepared in advance?",
      prayer: "God, You chose me before the foundation of the world. Help me live from that truth instead of constantly trying to earn it. Let the identity You have given me shape how I carry myself, how I lead, and what I believe I am capable of building. Amen.",
    },
    {
      id: "thematic-vision-7",
      day: 7,
      track: "vision",
      trackName: "Vision & Purpose",
      reading: "Romans 8 (NIV)",
      hook: "One of the most powerful chapters in the entire Bible. It does not get easier -- it gets deeper every time you read it.",
      contextPreview: "Romans 8 is the kind of chapter that people return to across their entire lives...",
      context: "Romans 8 is the kind of chapter that people return to across their entire lives because it speaks into every season differently. It begins with no condemnation and ends with nothing can separate us from the love of God. Everything in between is a sustained argument for why the person who belongs to God has access to a different kind of life -- not easier, not free from suffering, but anchored in something that suffering cannot touch. This is not abstract theology. It is the most practical kind of truth there is.",
      principlePreview: "You are not defined by your current circumstances, your failures, or your limitations...",
      principle: "You are not defined by your current circumstances, your failures, or your limitations. Romans 8:28 is one of the most misused verses in scripture -- people quote it as a promise that everything will work out the way they want. But read in context, it says something harder and better. All things work together for good for those who love God and are called according to His purpose. The good it is pointing toward is conformity to the image of Christ -- becoming the kind of person whose life reflects God's character. That is a longer arc than most people are building toward.",
      deepDive: "Romans 8 moves through several distinct movements. It opens by declaring freedom from condemnation for those in Christ. Then it shifts to the contrast between living by the flesh and living by the Spirit -- two fundamentally different orientations toward life. Then Paul introduces the idea of adoption -- not just forgiveness, but full sonship. You are not a servant trying to earn favor. You are a child with full inheritance rights. Then comes the honest acknowledgment that the present suffering is real -- but it is not the final word. Creation itself is groaning, waiting for the full revelation of what God is doing. And then the chapter closes with one of the most sweeping declarations in all of scripture. Nothing -- not death, not life, not angels, not present circumstances, not future fears, not any power in existence -- can separate you from the love of God.",
      application: "Two things for today. First, audit what is defining your sense of purpose right now. Is it your results, your reputation, your revenue? Romans 8 locates your identity in something that cannot be taken from you. Build from that foundation rather than constantly trying to rebuild it through performance. Second, take the long view on what God is doing in your life. The things that feel like setbacks right now may be part of a shaping process you cannot fully see yet. That does not make the difficulty easier -- but it changes how you carry it.",
      question: "What are you allowing to define your worth and direction right now that Romans 8 says has no final authority over you? And what would it look like to build from a foundation of sonship instead of performance?",
      prayer: "God, nothing can separate me from Your love. Help me actually live from that truth. When my circumstances feel defining, remind me of what Romans 8 says about who I am and what You are doing. Let me build from identity, not from fear. Amen.",
    },
    {
      id: "thematic-vision-8",
      day: 8,
      track: "vision",
      trackName: "Vision & Purpose",
      reading: "Nehemiah 1-2 (NIV)",
      hook: "A man hears about a broken city, sits down and weeps, then builds one of the most remarkable leadership plans in the Bible.",
      contextPreview: "Nehemiah is one of the most practical leadership and vision stories in all of scripture...",
      context: "Nehemiah is one of the most practical leadership and vision stories in all of scripture. He is not a prophet or a priest. He is a cup-bearer to a foreign king -- essentially a high-ranking servant in a powerful empire. When he hears that Jerusalem's walls are broken down and its people are in disgrace, something breaks open in him. He weeps. He fasts. He prays for four months before he says a single word to anyone with the power to help him. And then, when the moment comes, he is completely ready.",
      principlePreview: "Nehemiah did not move until the vision was clear, the prayer was done, and the moment was right...",
      principle: "Nehemiah did not move until the vision was clear, the prayer was done, and the moment was right. Chapter 1 is entirely prayer and preparation. Chapter 2 is action. The sequence matters. Most people either spend forever preparing and never act, or they act immediately without adequate preparation. Nehemiah does both fully. Four months of prayer followed by a precise, well-thought-out request delivered at exactly the right moment. When the king asks what he needs, Nehemiah has a complete answer -- timber, letters of safe passage, a timeline. He had been thinking about this for months. When his moment came, he was ready.",
      deepDive: "Look closely at Nehemiah 2. The king notices that Nehemiah is sad and asks what is wrong. This was actually dangerous -- appearing sad in the presence of a Persian king could be considered disrespectful and could cost you your life. But Nehemiah had prayed for this moment. The text says he was very much afraid, and then it says he prayed to the God of heaven and then answered the king. That detail is not incidental. In the space between the question and the answer, Nehemiah prays. Then he gives a precise, well-prepared response. He knows what he needs. He knows the timeline. He knows the logistics. He has already surveyed the problem in his mind. When God opens the door, Nehemiah walks through it fully prepared. Then in verse 12, he goes out at night and surveys the walls before telling anyone his plan. He builds a complete picture before he asks anyone to follow him.",
      application: "Three things from Nehemiah 1 and 2. First, let yourself be moved by what breaks your heart. Nehemiah did not try to talk himself out of his grief over Jerusalem. He let it fuel his prayer and his preparation. The things that genuinely break your heart are often pointing toward the things you are called to build. Second, pray before you pitch. Nehemiah prayed for four months before he made his request. Most people spend four minutes. Let the vision be shaped in prayer before it is presented to people. Third, do your homework before you ask others to follow you. Nehemiah surveyed the walls at night, alone, before he gathered the community. Know your vision well enough to speak to the logistics, not just the inspiration.",
      question: "What broken thing in your world has moved you deeply but that you have not yet brought fully to God in sustained prayer? And how prepared are you to act when the moment actually opens?",
      prayer: "God, give me the grief that leads to action and the patience that leads to preparation. Help me pray before I pitch, survey before I speak, and move when You open the door -- ready, not reactive. Amen.",
    },
    {
      id: "thematic-vision-9",
      day: 9,
      track: "vision",
      trackName: "Vision & Purpose",
      reading: "Acts 9 (NIV)",
      hook: "The man who was most violently opposed to everything Jesus stood for gets redirected by God in one moment on a road.",
      contextPreview: "Acts 9 is one of the most dramatic turning points in the entire New Testament...",
      context: "Acts 9 is one of the most dramatic turning points in the entire New Testament. Saul is not a confused person looking for meaning. He is a highly educated, deeply committed man who is actively hunting down and imprisoning followers of Jesus because he believes he is doing what God wants. He has authority, momentum, and absolute certainty about his direction. And then, in a single moment on the road to Damascus, everything he thought he knew gets completely dismantled. The vision he had been operating from turns out to be pointing in exactly the wrong direction.",
      principlePreview: "God is not limited by the direction you have already been moving...",
      principle: "God is not limited by the direction you have already been moving. The calling on Paul's life was not diminished by the years he spent opposing it. In fact, the same intensity, intelligence, and commitment that made him effective at persecution made him extraordinarily effective at the work God had for him. The redirection did not waste what came before -- it repurposed it entirely. That is one of the most hopeful things in scripture for anyone who has been moving hard in the wrong direction.",
      deepDive: "Acts 9 moves quickly. Saul encounters Jesus on the road, is blinded, fasts for three days, and is visited by a disciple named Ananias who has every human reason to be afraid of him. The exchange between God and Ananias is one of the most honest in scripture. God tells Ananias to go to Saul. Ananias essentially says -- do You know who this is? God's response is striking. I will show him how much he must suffer for my name. The calling on Paul's life was not a promotion to comfort. It was a commissioning to a life of radical purpose that would cost him enormously. Then verse 20 says that immediately Saul began to preach in the synagogues that Jesus is the Son of God. The same energy, redirected. The same voice, carrying a different message.",
      application: "Two things to take from Acts 9. First, do not assume that where you have been disqualifies you from where God is calling you. Paul had blood on his hands. He had actively worked against the thing he would spend the rest of his life building. If God could use Paul's history without being limited by it, He can do the same with yours. Second, pay attention to the redirections. Sometimes the most significant moments in a vision story are not the launches -- they are the unexpected interruptions that turn out to be invitations. What in your life right now feels like a disruption that might actually be a redirection?",
      question: "Is there something in your past that you believe disqualifies you from a calling God has placed on your life? And is there something that currently feels like a disruption that might actually be a redirection?",
      prayer: "God, You redirected the most unlikely person and made him the most effective builder in the early church. Nothing in my history is too far gone for You to repurpose. Show me where I might be moving hard in the wrong direction, and give me the courage to stop and listen when You speak. Amen.",
    },
    {
      id: "thematic-vision-10",
      day: 10,
      track: "vision",
      trackName: "Vision & Purpose",
      reading: "Revelation 21 (NIV)",
      hook: "The final chapter of the entire story. What God builds at the end tells you everything about what He valued from the beginning.",
      contextPreview: "Revelation 21 is the destination the entire Bible has been moving toward...",
      context: "Revelation 21 is the destination the entire Bible has been moving toward. After everything -- the fall, the flood, the exile, the cross, the resurrection, the long arc of human history -- this is where it ends. Not with destruction, not with defeat, but with God making His home among His people. A new heaven. A new earth. A new Jerusalem coming down from heaven, prepared like a bride. The word new here in the original Greek is not neos, which means recently made. It is kainos -- which means renewed, transformed, made whole. God does not throw away what He made. He redeems it.",
      principlePreview: "The God you are building for is not managing decline -- He is building toward something...",
      principle: "The God you are building for is not managing decline -- He is building toward something that will last forever. Revelation 21 is the ultimate vision statement. Everything God has been doing across the entire sweep of human history has been moving toward this -- a world restored, a people redeemed, a relationship fully repaired. When you build with that end in mind, it changes what you build and why. Legacy is not about being remembered. It is about building things that are aligned with what God is ultimately restoring.",
      deepDive: "Revelation 21 opens with a voice from the throne saying -- look, I am making everything new. Then God speaks directly. I am the Alpha and the Omega, the beginning and the end. The one who is thirsty, I will give water from the spring of life. To the one who overcomes, I will give an inheritance. These are not metaphors for a distant spiritual reality. They are the culmination of every promise made across the entire Bible. Then the chapter describes the new Jerusalem in extraordinary detail -- its dimensions, its gates, its foundations, its light. There is no temple in this city because God Himself is the temple. There is no sun or moon because the glory of God is its light. Everything that was a symbol or a shadow in the old world becomes a direct reality in the new one.",
      application: "Two things to close out this path with. First, let the ending shape the middle. The vision God is building toward is one of total restoration and wholeness. When you build things that reflect those values -- honesty, justice, genuine care for people, work that actually serves rather than just extracts -- you are contributing to something larger than your own story. Second, build for legacy, not just for now. The temptation in entrepreneurship is to optimize for the immediate -- revenue, growth, attention. Revelation 21 asks a different question. What are you building that will matter on the longest timeline? Not because you will be remembered, but because it is worth building.",
      question: "What would change about how you build if you kept the ending of the story in mind every day? What are you currently optimizing for that does not hold up on a longer timeline?",
      prayer: "God, You are making all things new. Help me build things that are aligned with what You are ultimately restoring. Give me a vision that is bigger than my lifetime, rooted in Your character, and pointed toward the world You are building. Amen.",
    },
  
    {
      id: "thematic-leadership-1",
      day: 11,
      track: "leadership",
      trackName: "Leadership & Authority",
      reading: "Exodus 18 (NIV)",
      hook: "Moses was working himself to death and didn't see it. His father-in-law noticed in one day.",
      contextPreview: "Moses has just led one of the most dramatic moments in human history -- the exodus from Egypt...",
      context: "Moses has just led one of the most dramatic moments in human history. The Red Sea parted. Pharaoh's army was defeated. A nation of slaves walked out free. And now Moses is sitting from morning until evening listening to every dispute, every conflict, every question from a community of over a million people. He is the only point of contact. He believes this is what leadership looks like. His father-in-law Jethro arrives, watches for one day, and tells him directly -- what you are doing is not good. You will wear yourself out. And the people you are leading will wear out too.",
      principlePreview: "The leader who does everything is not the most committed person in the room -- they are the biggest bottleneck...",
      principle: "The leader who does everything is not the most committed person in the room -- they are the biggest bottleneck. Moses was not failing because he lacked ability or dedication. He was failing because he had built a system where everything ran through him. That is not sustainable leadership. It is a single point of failure dressed up as devotion. Jethro's observation is still one of the most practical pieces of leadership advice ever recorded. You cannot do this alone.",
      deepDive: "Look at Jethro's advice carefully. It has three distinct layers. First, teach the people God's decrees and instructions -- the leader is still responsible for vision, values, and direction. That does not get delegated. Second, select capable people who fear God and are trustworthy -- notice the criteria. Capability matters, but character comes first. Jethro does not say find the most talented people. He says find people who fear God, who hate dishonest gain, who are trustworthy. Third, set up a tiered structure -- leaders of thousands, hundreds, fifties, and tens. Only the most difficult cases come to Moses. Everything else gets handled at the appropriate level. The genius of this system is not the org chart. It is that Moses was willing to receive the feedback and actually change. He did not defend his current approach. He listened, and he acted.",
      application: "Three things from Exodus 18. First, identify your bottlenecks. Where are decisions piling up because they can only go through you? That is not a sign of your importance -- it is a sign of a structural problem that is limiting everyone. Second, hire and promote for character before competence. Skills can be trained. Integrity cannot be easily installed in someone who does not already have it. When you are building a team, let Jethro's criteria shape your selection. Third, be willing to receive the feedback Jethro gave Moses. Someone in your life may have been trying to tell you that your current approach is not sustainable. That conversation deserves more than a polite nod.",
      question: "Where are you the bottleneck in your own organization or life? And who around you has been trying to tell you something about your leadership that you have not fully received yet?",
      prayer: "God, show me where I am trying to carry what was never meant to be carried alone. Give me the humility to receive honest feedback, the wisdom to build structure that serves people well, and the discernment to develop leaders around me. Amen.",
    },
    {
      id: "thematic-leadership-2",
      day: 12,
      track: "leadership",
      trackName: "Leadership & Authority",
      reading: "Nehemiah 4-5 (NIV)",
      hook: "Nehemiah is rebuilding a city while his enemies mock him, threaten him, and his own people start to break.",
      contextPreview: "Nehemiah 4 and 5 are what leadership under real pressure actually looks like...",
      context: "Nehemiah 4 and 5 are what leadership under real pressure actually looks like. The walls of Jerusalem are being rebuilt and the opposition is immediate. Sanballat and Tobiah mock the workers publicly, calling their efforts worthless and their construction pathetic. Then the threats escalate -- rumors of military attack begin to circulate. The workers are exhausted and afraid. And then, as if external opposition were not enough, chapter 5 reveals an internal crisis. The people are exploiting each other. The wealthy are charging interest on loans to their own community members who are already suffering. Nehemiah is dealing with enemies outside the walls and corruption inside them simultaneously.",
      principlePreview: "Leadership is not tested when everything is going well -- it is revealed when pressure comes from every direction at once...",
      principle: "Leadership is not tested when everything is going well -- it is revealed when pressure comes from every direction at once. Nehemiah faces external opposition, physical threat, internal conflict, and economic injustice all within the span of two chapters. What makes his leadership remarkable is not that he was unaffected. It is that he did not let any single pressure collapse the mission. He adapted his approach -- workers built with one hand and held a weapon in the other -- without abandoning the goal.",
      deepDive: "In chapter 4, Nehemiah's response to the threat of attack is practical and prayerful. He prays, posts guards, and reorganizes the workers so that families are stationed together at vulnerable points. He does not pretend the threat is not real. He does not let the threat stop the work. He gives the people a rallying point -- remember the Lord, who is great and awesome, and fight for your families. Then in chapter 5, the problem shifts entirely. It is no longer an external enemy. It is internal injustice. Nehemiah is furious when he discovers what is happening. But the text says he pondered the matter in his mind before speaking. He did not react from his emotion. He thought first, then confronted. He called the leaders together, laid out the problem clearly, and demanded that they make it right. They agreed. And Nehemiah reinforced the commitment with a public oath.",
      application: "Three things from Nehemiah 4 and 5. First, build the habit of praying and acting simultaneously. Nehemiah did not choose between prayer and strategy -- he did both. When facing opposition, the temptation is to default entirely to either spiritual response or practical response. The most effective leaders do both at the same time. Second, do not let external pressure distract you from internal problems. Nehemiah was dealing with a real external threat and still confronted the internal injustice when he discovered it. Hard problems outside do not give you permission to ignore hard problems inside. Third, ponder before you confront. Nehemiah was angry -- righteously so -- but he thought before he spoke. The confrontation was more effective because he was prepared, not reactive.",
      question: "What internal problem in your organization or relationships are you avoiding because the external pressures feel more urgent? And what would it look like to address both without letting one excuse the other?",
      prayer: "God, give me the steadiness to lead through pressure from multiple directions without abandoning what I am building. Help me pray and act at the same time, address hard things without losing composure, and never let outside threats become an excuse to ignore what needs to be fixed inside. Amen.",
    },
    {
      id: "thematic-leadership-3",
      day: 13,
      track: "leadership",
      trackName: "Leadership & Authority",
      reading: "1 Samuel 16-17 (NIV)",
      hook: "God rejects the most impressive candidate in the room and chooses the one nobody thought to invite.",
      contextPreview: "1 Samuel 16 and 17 tell the story of how Israel's greatest king was selected and then proved himself...",
      context: "1 Samuel 16 and 17 tell the story of how Israel's greatest king was selected and then stepped into his first moment of national significance. In chapter 16, God sends Samuel to anoint a new king from the sons of Jesse. Samuel sees Eliab, the oldest -- tall, impressive, exactly what a king is supposed to look like -- and assumes this is the one. God stops him immediately. Do not consider his appearance or his height. The Lord does not look at the things people look at. People look at the outward appearance, but the Lord looks at the heart. Seven sons pass in front of Samuel and none of them are chosen. The youngest is out in the field with the sheep. Nobody thought to call him in.",
      principlePreview: "The criteria the world uses to identify leaders and the criteria God uses are fundamentally different...",
      principle: "The criteria the world uses to identify leaders and the criteria God uses are fundamentally different. Samuel -- a seasoned prophet -- made the same mistake most people make. He evaluated based on what was visible and impressive. God corrects him with one of the clearest statements in scripture about what actually qualifies someone for significant responsibility. The heart. Not the resume, not the appearance, not the family position, not the confidence in the room. The heart.",
      deepDive: "Chapter 17 then shows us what that heart looks like in action. When Goliath is taunting Israel and the entire army -- including Eliab -- is paralyzed by fear, David arrives with lunch for his brothers and immediately asks the right question. Who is this uncircumcised Philistine that he should defy the armies of the living God? David is not fearless because he is naive. He is confident because his framework is different. He has already seen God work in invisible moments -- protecting his sheep from lions and bears when no one was watching. He brings that private track record into a public moment. Saul tries to put his armor on David. It does not fit. David goes as himself.",
      application: "Three things from 1 Samuel 16 and 17. First, examine the criteria you are using to select and promote people. Are you choosing based on appearance, confidence, and impressiveness -- or based on character, faithfulness, and how people behave when no one is watching? Second, pay attention to who is being overlooked. David was not invited to the selection. He was doing his job faithfully in obscurity. Some of the most significant people in your organization or community might be doing the same thing right now. Third, your private track record matters. David's confidence in public was built on faithfulness in private. The invisible moments are not wasted -- they are the preparation.",
      question: "Who are you overlooking in your organization or community because they do not look like what you expect a leader to look like? And what does your private track record say about how you handle responsibility when no one is watching?",
      prayer: "God, correct my criteria for leadership the way You corrected Samuel's. Help me see past the impressive and pay attention to the faithful. And in my own life, help me build the kind of private track record that makes public responsibility something I am genuinely ready for. Amen.",
    },
    {
      id: "thematic-leadership-4",
      day: 14,
      track: "leadership",
      trackName: "Leadership & Authority",
      reading: "Mark 10 (NIV)",
      hook: "Two of Jesus' closest followers ask for the best seats in the room. His response redefines what greatness actually means.",
      contextPreview: "Mark 10 covers a wide range of conversations Jesus has about what the kingdom of God actually values...",
      context: "Mark 10 covers a wide range of conversations -- about marriage, about children, about wealth, about following Jesus. But the chapter reaches its sharpest point when James and John pull Jesus aside with a private request. They want to sit at His right and left hand when He comes into His glory. They want the top seats. The other disciples find out and they are indignant -- not because they think the request is wrong, but almost certainly because they wanted the same thing and James and John got there first. Jesus gathers them all and delivers one of the clearest statements in scripture about the difference between the world's model of leadership and His.",
      principlePreview: "In God's economy, the path to greatness runs directly through service -- not around it...",
      principle: "In God's economy, the path to greatness runs directly through service -- not around it. Jesus does not say ambition is wrong. He does not rebuke James and John for wanting to be significant. He redirects the definition. Whoever wants to become great among you must be your servant. Whoever wants to be first must be slave of all. And then He points to Himself. The Son of Man did not come to be served but to serve, and to give His life as a ransom for many. The model is not theoretical. It is embodied.",
      deepDive: "What makes this passage particularly important for builders and leaders is the contrast Jesus draws. He says the rulers of the Gentiles lord it over them, and their high officials exercise authority over them. He is describing the dominant leadership model of the era -- positional, hierarchical, power-based. And He says explicitly -- not so with you. This is not a suggestion for a leadership style. It is a fundamental redefinition of what authority is for. Authority in the kingdom is not about elevation. It is about capacity to serve. The person with the most authority has the most responsibility to give, not the most right to receive. Mark 10 also contains the story of blind Bartimaeus just a few verses later -- a man who is pushed aside by the crowd but whom Jesus stops for. The chapter is making a consistent argument: the people everyone else overlooks are exactly the ones great leaders stop for.",
      application: "Two things from Mark 10. First, audit your leadership motivation. Are you pursuing influence, position, or authority because of what it will allow you to build and give -- or because of what it will allow you to receive and be recognized for? The honest answer to that question shapes everything downstream. Second, pay attention to who you stop for. Jesus stopped for Bartimaeus when the crowd was trying to silence him. Who in your world is being pushed aside or overlooked that deserves your full attention? Great leadership in the kingdom is measured by who you stop for, not just who you are seen with.",
      question: "What is actually motivating your pursuit of influence and leadership right now? And who are you walking past that you should be stopping for?",
      prayer: "God, strip away the parts of my ambition that are about my own elevation and replace them with a genuine desire to serve. Make me the kind of leader who stops for the people everyone else is walking past. Amen.",
    },
    {
      id: "thematic-leadership-5",
      day: 15,
      track: "leadership",
      trackName: "Leadership & Authority",
      reading: "Luke 16 (NIV)",
      hook: "Jesus tells a parable about a dishonest manager and then draws one of the most counterintuitive conclusions in the Gospels.",
      contextPreview: "Luke 16 is one of the most misunderstood chapters in the New Testament...",
      context: "Luke 16 is one of the most misunderstood chapters in the New Testament. It opens with a parable about a manager who is about to be fired for wasting his master's resources. Rather than giving up, the manager makes shrewd deals with the people who owe his master money -- reducing their debts to earn their goodwill before he loses his position. Jesus then says the master commended the dishonest manager for his shrewdness. This has confused people for centuries. Jesus is not commending dishonesty. He is observing that people who pursue worldly goals often think more strategically and act more decisively than people who claim to be pursuing eternal ones.",
      principlePreview: "Faithfulness in small things is not a consolation prize -- it is the actual qualification for larger responsibility...",
      principle: "Faithfulness in small things is not a consolation prize -- it is the actual qualification for larger responsibility. Verse 10 makes this explicit. Whoever can be trusted with very little can also be trusted with much, and whoever is dishonest with very little will also be dishonest with much. This is not a motivational principle -- it is a description of how character actually works. The person you are when the stakes are low is the person you will be when the stakes are high. There is no switch that flips when the opportunity gets bigger.",
      deepDive: "The chapter then pivots to one of the clearest statements Jesus makes about money. You cannot serve both God and money. The word serve here is the same word used for slavery. It is not saying you cannot have money or manage money. It is saying money will always be trying to become your master, and you have to decide in advance what your relationship to it actually is. The Pharisees, who loved money, heard all of this and sneered at Jesus. He responds by pointing out that what is highly valued among people is detestable in God's sight. The gap between what the world rewards and what God values is worth sitting with for a long time.",
      application: "Two things from Luke 16. First, take your current level of responsibility seriously regardless of how small it feels. The way you manage your current resources, relationships, and opportunities is forming the character that will determine what you are trusted with next. Do not sleepwalk through the current season because you are waiting for a bigger one. Second, get honest about your relationship with money. Not whether you have enough of it, but whether it is functioning as a tool or as a master. Jesus is not making an argument against wealth. He is making an argument that something will be in charge of your decisions -- and you need to decide whether that is God or money before the pressure comes.",
      question: "How are you handling the resources, relationships, and responsibilities you currently have -- in a way that would qualify you for more? And what is actually in charge of your financial decisions right now?",
      prayer: "God, make me faithful with what I have right now. Not because I am trying to earn more, but because faithfulness is the right way to live. And help me be honest about what is actually directing my relationship with money. I want You in that seat, not wealth. Amen.",
    },
    {
      id: "thematic-leadership-6",
      day: 16,
      track: "leadership",
      trackName: "Leadership & Authority",
      reading: "Proverbs 27-28 (NIV)",
      hook: "Two chapters that cut through every illusion leaders carry about themselves and the people around them.",
      contextPreview: "Proverbs 27 and 28 are dense with observations about human nature, leadership, and the particular dangers of self-deception...",
      context: "Proverbs 27 and 28 are dense with observations about human nature, leadership, and the particular dangers that come with influence and wealth. These are not abstract principles. They are the kind of things you only notice if you have watched a lot of people succeed and fail up close -- patterns in how pride works, how flattery misleads, how leaders lose their way, and what actually keeps a community together over time. Reading Proverbs slowly is different from reading it fast. The observations land differently when you stop at each one.",
      principlePreview: "Knowing the condition of what you are responsible for is not a management technique -- it is a leadership obligation...",
      principle: "Knowing the condition of what you are responsible for is not a management technique -- it is a leadership obligation. Proverbs 27:23 says it plainly. Be sure you know the condition of your flocks, give careful attention to your herds. For riches do not endure forever. The agricultural image translates directly. Know your people. Know your business. Know the actual condition of the things you are responsible for -- not the version that gets reported to you in meetings, but the real condition on the ground. Leaders who operate from a filtered picture of reality will eventually be surprised by what was obvious to everyone below them.",
      deepDive: "Chapter 27 opens with a warning against boasting about tomorrow -- you do not know what a day may bring. Then it introduces a contrast between flattery and honest wounds. Wounds from a friend can be trusted, but an enemy multiplies kisses. This is one of the most important observations in all of Proverbs for anyone in leadership. The people who tell you what you want to hear are not your allies. The people who will risk the relationship to tell you the truth are. Then chapter 28 goes directly at the connection between integrity and leadership effectiveness. When the righteous thrive, the people rejoice; when the wicked rule, the people groan. Leadership character is not a private matter. It has community consequences. The chapter also returns repeatedly to the theme of self-deception -- the person who trusts in themselves is a fool, but whoever walks in wisdom is kept safe.",
      application: "Three things from Proverbs 27 and 28. First, identify who in your life is actually telling you the truth. Not the people who agree with you, but the people who will push back when you are wrong. Those relationships are more valuable than almost anything else in your life. Protect them and listen to them. Second, get closer to the real condition of what you are responsible for. Whatever you lead -- a company, a team, a family -- there is probably a gap between the version you see and the version that actually exists. Close that gap. Third, take the warning about self-deception seriously. The most dangerous blind spots are the ones that feel like confidence.",
      question: "Who in your life is actually allowed to tell you hard truths? And when is the last time you got close enough to what you are responsible for to see its real condition rather than the reported version?",
      prayer: "God, protect me from the flattery that feels good and point me toward the honesty that makes me better. Give me the humility to know the real condition of what I am responsible for, and the wisdom to act on what I find. Amen.",
    },
    {
      id: "thematic-leadership-7",
      day: 17,
      track: "leadership",
      trackName: "Leadership & Authority",
      reading: "Acts 6-7 (NIV)",
      hook: "The early church hits its first major internal crisis. How the apostles respond becomes a model for every organization that follows.",
      contextPreview: "Acts 6 opens with a problem that every growing organization eventually faces -- the people leading it cannot keep doing everything themselves...",
      context: "Acts 6 opens with a problem that every growing organization eventually faces. The community is growing, and a group of people feel like they are being overlooked and underserved. Specifically, the Greek-speaking widows are being neglected in the daily distribution of food while the Hebrew-speaking widows are not. This is a real problem. It is also the kind of problem that can quietly fracture a community if it is not addressed with both seriousness and clarity. The apostles' response to this moment is one of the clearest examples of principled delegation in scripture.",
      principlePreview: "The best leaders protect their highest contribution by being ruthless about what only they can do...",
      principle: "The best leaders protect their highest contribution by being ruthless about what only they can do. The apostles do not dismiss the complaint or try to solve the problem themselves while continuing to carry everything else. They name the problem clearly, establish a principle -- it would not be right for us to neglect the ministry of the word of God in order to wait on tables -- and then empower others to solve it. The principle is not that waiting on tables is unimportant. It is that the wrong people doing the right things produces mediocrity in both.",
      deepDive: "The seven people selected to oversee the food distribution are described with specific criteria. Full of the Spirit and wisdom. Again -- not just competent, but character-qualified. And the result is immediate. The word of God spread. The number of disciples increased rapidly. Even a large number of priests became obedient to the faith. Solving a delegation problem unlocked a multiplication of impact. Chapter 7 then follows Stephen -- one of the seven -- delivering the most comprehensive theological address in the book of Acts before becoming the first martyr of the early church. The person selected to solve a food distribution problem turns out to be one of the most articulate voices for the gospel in the entire New Testament. You never know what you are unleashing when you genuinely develop and trust the people around you.",
      application: "Two things from Acts 6 and 7. First, name the real problem clearly before trying to solve it. The apostles did not paper over the complaint or manage it quietly. They brought it into the open, acknowledged it, and addressed it structurally. Most leadership problems get worse because the leader is unwilling to name them plainly. Second, develop people for more than their current role. The seven were selected to handle a practical need, and one of them changed the trajectory of the early church. When you genuinely invest in people and give them real responsibility, you often find out they are capable of far more than the role you put them in.",
      question: "What are you still doing that someone else should be doing -- and what is that costing the things only you can do? And who around you are you underestimating?",
      prayer: "God, help me be clear about what only I can do and ruthless about releasing everything else to people who are equipped to carry it. Show me who I am underestimating, and give me the courage to actually trust them. Amen.",
    },
    {
      id: "thematic-leadership-8",
      day: 18,
      track: "leadership",
      trackName: "Leadership & Authority",
      reading: "1 Timothy 3-4 (NIV)",
      hook: "Paul gives Timothy a list of leadership qualifications that has nothing to do with talent or results.",
      contextPreview: "Paul is writing to Timothy, a young leader he has mentored, who is now overseeing the church in Ephesus...",
      context: "Paul is writing to Timothy, a young leader he has mentored, who is now overseeing a significant and complex church community. Timothy is dealing with false teachers, internal conflict, and the weight of leading people who are older and more experienced than he is. Into that context, Paul gives him a framework for identifying and selecting leaders -- and the framework is almost entirely character-based. It is one of the most counter-cultural leadership texts in the Bible because it evaluates people by who they are, not what they have achieved.",
      principlePreview: "The qualifications God cares most about in leaders are the ones that are hardest to fake over time...",
      principle: "The qualifications God cares most about in leaders are the ones that are hardest to fake over time. Temperate, self-controlled, respectable, hospitable, not given to drunkenness, not violent but gentle, not quarrelsome, not a lover of money. These are not personality types. They are patterns of behavior that reveal character. Paul is describing someone whose private life and public life are consistent -- someone who manages their own household well, has a good reputation with outsiders, and is not a recent convert still forming their identity. The list is a description of maturity, not talent.",
      deepDive: "Chapter 3 covers the qualifications for overseers and deacons, and in both cases the emphasis is the same. Character first. The ability to teach is mentioned once. Everything else is about integrity, self-control, and how a person manages their relationships and home. Paul even says that if someone does not know how to manage their own family, how can they take care of God's church? That is a direct and uncomfortable question. Chapter 4 then shifts to Paul's instructions to Timothy personally. Do not let anyone look down on you because you are young. Set an example in speech, in conduct, in love, in faith, in purity. Watch your life and doctrine closely. The leadership qualifications Paul sets for others, he requires Timothy to embody first.",
      application: "Two things from 1 Timothy 3 and 4. First, use Paul's list as a self-evaluation tool. Not as a way to condemn yourself, but as an honest inventory of where your character is genuinely strong and where it still needs development. The areas where you feel defensive when reading the list are often the areas worth the most attention. Second, pay attention to how you manage what is closest to you. Paul's observation that household management reflects leadership capacity is not just ancient wisdom -- it is a pattern that holds. How you treat the people who know you best is a more reliable indicator of your leadership character than how you perform in public.",
      question: "If the people closest to you -- your family, your closest collaborators, the people who see you when no one else is watching -- were asked to evaluate your leadership character against Paul's list, what would they say?",
      prayer: "God, build in me the character that qualifies me for the responsibility You are calling me toward. Not the appearance of it, but the substance. Start with the things closest to me and work outward. Amen.",
    },
    {
      id: "thematic-leadership-9",
      day: 19,
      track: "leadership",
      trackName: "Leadership & Authority",
      reading: "Daniel 6 (NIV)",
      hook: "Daniel is the most effective leader in a corrupt government. That is exactly why they are trying to destroy him.",
      contextPreview: "Daniel 6 takes place years after the events of the fiery furnace in chapter 3...",
      context: "Daniel 6 takes place years into Daniel's career as a leader in a foreign empire. He has served under multiple kings and has distinguished himself so thoroughly that the current king, Darius, is planning to set him over the entire kingdom. The other administrators and satraps are not celebrating this. They are threatened by it. They investigate Daniel looking for grounds to bring charges against him -- and they find nothing. His only vulnerability is his faith. So they construct a law specifically designed to make his faithfulness illegal, and they convince the king to sign it without fully understanding the implications.",
      principlePreview: "The clearest sign that your leadership has integrity is when the only thing your opponents can attack is your convictions...",
      principle: "The clearest sign that your leadership has integrity is when the only thing your opponents can attack is your convictions. Daniel's enemies investigated him thoroughly and found no corruption, no negligence, no dishonesty. The only leverage they had was his prayer life. That is a standard worth aspiring to. Not the absence of opposition -- but opposition that has nothing to work with except who you actually are.",
      deepDive: "When the law is signed, Daniel does not hold a strategy session or look for a legal workaround. He goes home, opens his windows toward Jerusalem, and prays three times as he had always done. Not as an act of protest. Not as a calculated statement. As a continuation of what he had always done. The consistency is the point. He was not more faithful after the law was passed than he was before it. His private practice was already so established that making it illegal did not change it. He is thrown into the lion's den. The king spends the night fasting, unable to sleep. In the morning he rushes to the den and calls out -- Daniel, servant of the living God, has your God been able to rescue you? The answer reshapes an empire. Darius issues a new decree across the entire kingdom acknowledging the God of Daniel.",
      application: "Two things from Daniel 6. First, build your private practices now -- before anyone makes them costly. Daniel's consistency in the lion's den was possible because of years of consistency in ordinary moments. The habits you build when there is no pressure will carry you through the moments when there is. Second, lead with such integrity that the only thing your opponents can target is your faith. That is not a passive standard -- it requires active vigilance about how you handle money, how you treat people, how you conduct business. The goal is not a perfect reputation. It is a clean conscience.",
      question: "What would your opponents find if they investigated you the way Daniel's did? And what private practices are you building now that will hold when the pressure actually comes?",
      prayer: "God, make my leadership so clean that the only thing anyone can use against me is my faithfulness to You. Build in me the kind of private consistency that holds under public pressure. And when the lion's den comes, let it be a testimony, not a disaster. Amen.",
    },
    {
      id: "thematic-leadership-10",
      day: 20,
      track: "leadership",
      trackName: "Leadership & Authority",
      reading: "John 13 (NIV)",
      hook: "The night before His arrest and crucifixion, Jesus gets up from dinner, wraps a towel around His waist, and washes His disciples' feet.",
      contextPreview: "John 13 is one of the most loaded chapters in the entire New Testament...",
      context: "John 13 is one of the most loaded chapters in the entire New Testament. Jesus knows exactly what is coming. He knows Judas is about to betray Him. He knows Peter is about to deny Him three times. He knows He is hours away from arrest, torture, and death. And with all of that knowledge -- with the full weight of what is coming pressing down on this moment -- He gets up from dinner, takes off His outer clothing, wraps a towel around His waist, and begins washing His disciples' feet. This was the work of the lowest servant in the household. Nobody expected Jesus to do this. Peter refuses at first. The whole thing is disorienting because it is so far outside anyone's expectations of how someone with authority behaves.",
      principlePreview: "The most powerful leadership move Jesus ever made was not a miracle or a sermon -- it was a towel...",
      principle: "The most powerful leadership move Jesus ever made in that room was not a miracle or a sermon -- it was a towel. After He finishes, He asks them directly -- do you understand what I have done for you? You call me Teacher and Lord, and rightly so, for that is what I am. Now that I, your Lord and Teacher, have washed your feet, you also should wash one another's feet. He is not making a suggestion about a spiritual practice. He is redefining the entire structure of what authority is for. Authority in the kingdom exists to serve, not to be served.",
      deepDive: "John 13 also contains the moment when Jesus identifies His betrayer. He dips a piece of bread and gives it to Judas -- a gesture of honor and intimacy -- and Judas takes it and leaves. Jesus serves the man who is about to hand Him over to be killed. Then Jesus gives His disciples a new command -- love one another as I have loved you. The standard He sets is His own behavior. Not love one another nicely. Not love one another when it is convenient. Love one another the way I have loved you -- which means even the people who will fail you, betray you, and deny you. By this, He says, all people will know that you are my disciples. The credibility of the entire movement rests on how well its leaders love.",
      application: "Two things from John 13. First, identify the towel in your context. What is the equivalent of foot-washing for you right now -- the thing that is beneath your position, beneath your title, beneath what you think you should be doing -- that would communicate genuine servanthood to the people you lead? Do that thing this week, not as a performance, but as a practice. Second, take the new command seriously. Jesus says the world will know His followers by how they love each other. That standard applies to how you treat your team, your collaborators, your clients, and the people in your community. Love is not a soft concept in John 13. It is the primary leadership credential.",
      question: "What is the towel in your current context -- the act of service that is beneath your status but would mean everything to the people around you? And are the people you lead experiencing genuine love from you, or just competent management?",
      prayer: "God, give me the security that Jesus had -- secure enough in who I am that I can pick up the towel without losing anything. Make me the kind of leader whose authority exists entirely in service of the people I am called to lead. Amen.",
    },
    {
      id: "thematic-money-1",
      day: 1,
      track: "money",
      trackName: "Money & Stewardship",
      reading: "1 Timothy 6:6-10, 17-19 (NIV)",
      hook: "Paul writes the most misquoted verse about money in the Bible -- and what he actually said is sharper than people remember.",
      contextPreview: "Paul is writing to his protege Timothy, who is leading the church in Ephesus -- a wealthy commercial city...",
      context: "Paul is writing to his protege Timothy, who is leading the church in Ephesus -- a wealthy commercial city full of merchants, traders, and people pursuing prosperity. False teachers were treating godliness as a means to financial gain. Paul corrects this hard, but he does not say money is evil. He says the love of money is.",
      principlePreview: "The love of money is a root of all kinds of evil -- not money itself, but the heart that loves it...",
      principle: "The love of money is a root of all kinds of evil -- not money itself, but the heart that loves it. Paul does not condemn wealth. He condemns the misplaced affection for it. In the same passage, he tells the rich to be generous and rich in good deeds, not to feel guilty about having resources.",
      deepDive: "Paul's instructions to the wealthy are direct: do not be arrogant, do not put hope in wealth (which is uncertain), put hope in God (who provides everything), be generous, be willing to share. The phrase rich in good deeds is striking -- he is creating a different scoreboard. Wealth measured in dollars matters less than wealth measured in impact, generosity, and faithfulness. Verse 19 says this kind of life takes hold of life that is truly life. Real life is not what money buys; it is what generosity creates.",
      application: "Three principles for builders building wealth. One, money is a tool, not an identity. The moment your sense of self depends on your bank account, you have lost something more valuable than money. Two, generosity is a discipline, not a feeling. Schedule it, plan it, automate it -- do not wait until you feel generous. Three, contentment with godliness is great gain. Discontent is the engine of bad financial decisions. Build a business; do not let it build a hole.",
      question: "If your business doubled tomorrow, would your life look meaningfully different in spending or in giving? Your answer reveals what you actually believe about money.",
      prayer: "Father, You give me everything I have. Loosen my grip on wealth. Make me rich in good deeds, generous in spirit, and content in You. Amen.",
    },
    {
      id: "thematic-pressure-1",
      day: 1,
      track: "pressure",
      trackName: "Faith Under Pressure",
      reading: "Daniel 3:13-30 (NIV)",
      hook: "Three men face a furnace and answer with one of the most powerful sentences in scripture.",
      contextPreview: "Shadrach, Meshach, and Abednego were Jewish exiles serving in Babylon's government around 600 BC...",
      context: "Shadrach, Meshach, and Abednego were Jewish exiles serving in Babylon's government around 600 BC. King Nebuchadnezzar built a massive golden statue and commanded everyone to bow when the music played. They refused. The penalty for refusal was death by fire. They were brought before the most powerful man in the known world to defend themselves.",
      principlePreview: "Their answer is one of the most powerful expressions of faith under pressure in scripture...",
      principle: "Their answer is one of the most powerful expressions of faith under pressure in scripture. They tell the king: our God is able to save us. But even if He does not, we will not bow. They committed to obedience whether or not God rescued them. That is a different category of faith.",
      deepDive: "Notice the structure of their reply. First, an acknowledgment of God's power -- He is able. Second, an acknowledgment of God's freedom -- but even if He does not. Third, an unwavering commitment regardless of outcome -- we still will not serve your gods. Most people pray for outcomes; these three committed to obedience separate from outcomes. When they were thrown in, the fire did not even touch their clothes. A fourth figure walked with them in the flames -- many believe a pre-incarnate Christ. The king who tried to kill them ended up praising their God.",
      application: "Two truths for entrepreneurs in pressure seasons. One, God is able -- but His ability does not guarantee your preferred outcome. Faith says I trust You whether or not You give me what I want. That is the only kind of faith that survives hard seasons. Two, sometimes the rescue is in the fire, not from it. They did not avoid the furnace; they met God in it. Some of your most important spiritual experiences will happen inside difficulties, not before or after them.",
      question: "What outcome are you currently demanding from God in exchange for your faith? Are you willing to obey Him whether or not He gives it to you?",
      prayer: "God, You are able. Whether or not You rescue me from this season, I commit to walking with You. Meet me in the fire if that is where You are. Amen.",
    },
    {
      id: "thematic-wisdom-1",
      day: 1,
      track: "wisdom",
      trackName: "Wisdom & Decision Making",
      reading: "1 Kings 3:5-15 (NIV)",
      hook: "God offers a young king anything he wants. His answer changes the course of history.",
      contextPreview: "Solomon had just become king after his father David. He was young, inexperienced, and leading a nation he felt unequipped to lead...",
      context: "Solomon had just become king after his father David. He was young, inexperienced, and leading a nation he felt unequipped to lead. God appears to him in a dream and says: ask for whatever you want me to give you. Solomon could have asked for wealth, long life, or victory over enemies. He asked for wisdom -- specifically, a discerning heart to govern God's people and tell right from wrong.",
      principlePreview: "Wisdom is not knowing more facts -- it is having a discerning heart...",
      principle: "Wisdom is not knowing more facts -- it is having a discerning heart that can tell the difference between right and wrong, important and urgent, true and merely convincing. Solomon asked for the one resource he knew he could not generate himself.",
      deepDive: "Solomon's prayer reveals deep self-awareness: I am only a little child and do not know how to carry out my duties. Notice he did not ask God to make him look like a great leader; he asked to actually be one. God's response is striking -- because you asked for this and not for long life, wealth, or the death of your enemies, I will give you wisdom and the other things you did not ask for. The lesson: pursuing the right thing first often results in receiving the other things too. Solomon went on to build wealth, peace, and influence on a foundation of wisdom -- but the wisdom came first.",
      application: "Most entrepreneurs pursue success and hope wisdom catches up. Solomon flips the order: pursue wisdom and watch the rest fall in line. Three applications. One, every important decision deserves prayer before strategy. Praying about it forces you to slow down enough to actually think. Two, surround yourself with discerning people and listen when they push back. Wisdom often comes through community, not just solitude. Three, ask better questions. Most bad decisions come from solving the wrong problem well.",
      question: "If God offered you anything tomorrow, what would you actually ask for? Your honest answer reveals what you currently believe matters most.",
      prayer: "God, I am young in many ways, no matter my age. Give me a discerning heart. Help me ask You first, listen to wise people, and choose wisdom over shortcuts. Amen.",
    },
  ],
  old_new: [
    {
      id: "oldnew-1",
      day: 1,
      reading: "Psalm 1 + Matthew 7:24-27 (NIV)",
      hook: "Two passages, one truth: what you build on determines whether you survive the storm.",
      contextPreview: "Psalm 1 opens the book of Psalms with a portrait of two paths. Jesus closes the Sermon on the Mount with a portrait of two builders...",
      context: "Psalm 1 opens the book of Psalms with a portrait of two paths -- the way of the righteous and the way of the wicked. Jesus closes the Sermon on the Mount with a portrait of two builders -- one who builds on rock, one who builds on sand. Both passages, written hundreds of years apart, draw the same line: the foundation determines the outcome.",
      principlePreview: "What you root yourself in determines what you become...",
      principle: "What you root yourself in determines what you become. The Psalmist describes the righteous as a tree planted by streams of water -- yielding fruit, not withering. Jesus says the wise builder is the one who hears His words and puts them into practice. Both pictures point to the same truth: knowledge is not enough. Application is what holds.",
      deepDive: "Psalm 1 contrasts what we delight in. The righteous delight in God's word and meditate on it day and night. The wicked drift through life advised by people who do not know God. Jesus' parable assumes both builders heard His words -- the difference is whether they put those words into practice. Faith that does not change behavior is not faith yet. Both passages also point to a future test. The wicked will not stand in judgment. The house on sand will collapse when the storm comes. Foundations are tested in storms, not sunshine.",
      application: "Two questions for builders. One, what are you rooting yourself in? If your sense of identity, security, and direction comes mostly from your business performance, you have built on sand. Performance is volatile. God's word is not. Two, where is the gap between what you know and what you do? Most Christians do not have an information problem; they have an application problem. This week, do not learn anything new. Apply something you already know.",
      question: "What is one truth from scripture you already know but have not put into practice? Start there this week.",
      prayer: "Lord, root me in Your word. Build me on a foundation that holds when storms come. Show me where I am hearing without doing, and give me courage to apply, not just learn. Amen.",
    },
    {
      id: "oldnew-2",
      day: 2,
      reading: "Proverbs 3:5-12 + James 1:2-8 (NIV)",
      hook: "Old Testament wisdom and New Testament instruction agree: trials grow you when you respond with trust.",
      contextPreview: "Proverbs 3 calls readers to trust God with their whole heart. James, writing centuries later, tells believers to count trials as joy because they produce maturity...",
      context: "Proverbs 3 calls readers to trust God with their whole heart, not lean on their own understanding, and accept God's discipline as evidence of love. James, writing centuries later to early Christians scattered by persecution, tells them to consider trials pure joy because trials produce perseverance, and perseverance produces maturity. Different eras, same conclusion: difficulty is one of God's primary growth tools.",
      principlePreview: "Trials are not interruptions to your growth -- they are often the engine of it...",
      principle: "Trials are not interruptions to your growth -- they are often the engine of it. Proverbs frames it as discipline; James frames it as testing. Both say the same thing: God uses pressure to develop people. Avoiding all difficulty also means avoiding most growth.",
      deepDive: "Proverbs 3:5-6 is the trust framework. Trust with all your heart, do not lean on your own understanding, submit to God in everything, and He will direct your paths. Verses 11-12 add a layer most people skip: do not despise the Lord's discipline, because the Lord disciplines those He loves -- like a father with a son. James 1 takes the same idea and applies it to trials: when (not if) you face trials, count it joy, because the testing of your faith produces perseverance. Then James adds something practical: if you lack wisdom in the trial, ask God, who gives generously and without finding fault.",
      application: "Three principles for trials. One, lean less on your own understanding -- especially in hard seasons. Your understanding in the middle of pain is rarely accurate. Two, do not despise the discipline. The temptation in hard seasons is to interpret difficulty as God's absence; scripture often interprets it as God's presence. Three, ask for wisdom specifically. James says God will give it generously -- but most of us never ask. Pray for wisdom in the specific situation you are in right now.",
      question: "What current difficulty in your business or life are you treating as an obstacle that is actually a teacher? What might it be trying to grow in you?",
      prayer: "Father, when I am in pain, I lean hard on my own understanding. Teach me to lean on You instead. Use the difficulty to grow me, and give me wisdom right now in the situation I am facing. Amen.",
    },
    {
      id: "oldnew-3",
      day: 3,
      reading: "Joshua 1:1-9 + Philippians 4:10-13 (NIV)",
      hook: "Two leaders, two situations, one source of strength.",
      contextPreview: "Joshua had just inherited leadership of Israel after Moses died. Paul was writing from prison facing possible execution...",
      context: "Joshua had just inherited leadership of Israel after Moses died -- enormous expectations, an enormous task, and no one to fall back on. Paul was writing from prison facing possible execution, thanking the Philippians for their support. Two leaders, two completely different situations, one shared truth: strength does not come from circumstances; it comes from a Source.",
      principlePreview: "Real strength is not generated by circumstances -- it is given by God in every condition...",
      principle: "Real strength is not generated by circumstances -- it is given by God in every condition. God tells Joshua three times to be strong and courageous because His presence is the guarantee, not Joshua's ability. Paul says he can do all things through Christ -- meaning he has learned contentment in plenty and in want, because his strength source did not change.",
      deepDive: "Notice the parallel between Joshua 1 and Philippians 4. God tells Joshua: do not be afraid, do not be discouraged, the Lord your God will be with you wherever you go. Paul writes: I have learned the secret of being content in any and every situation. The secret is not stoicism or willpower -- it is the constant presence of God. Joshua had Canaan in front of him. Paul had a prison cell. Both received the same answer: I am with you. Strength is a posture toward God's presence, not a level of personal capability.",
      application: "For builders in any season, two takeaways. One, your strength is not your strength. The moment you start believing your success is fully self-generated, you have set yourself up to fall apart when conditions change. Both Joshua and Paul knew where their strength actually came from. Two, contentment is learned. Paul says it explicitly -- I have learned the secret. It is not automatic. It is not a personality type. It is a discipline cultivated over time, in both abundance and lack.",
      question: "What part of your current strength are you crediting to yourself that should be credited to God? And what season are you in right now -- abundance or lack -- that is teaching you contentment?",
      prayer: "Lord, You are with me wherever I go. My strength comes from You, not from my circumstances or ability. Teach me contentment in this season, whatever it is. Amen.",
    },
  ],
};

/* ============ HELPERS ============ */

const STORAGE_KEY = "entrepreneur-bible-app-v1";

function calcEstimate(pathDays, paceMultiplier) {
  const days = Math.round(pathDays * paceMultiplier);
  const years = (days / 365).toFixed(1);
  return { days, years };
}

function getEntriesForPath(pathId) {
  return ENTRIES[pathId] || [];
}

/* ============ APP ============ */

export default function App() {
  const [user, setUser] = useState(null);
  const [authLoaded, setAuthLoaded] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [state, setState] = useState({
    onboarded: false,
    userType: null,
    readingPath: null,
    pace: null,
    completedDays: [],
    unlockedDays: [],
    notes: {},
    bookmarks: [],
    streak: 0,
    lastCompleted: null,
  });
  const [screen, setScreen] = useState("onboarding");
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [activeEntryId, setActiveEntryId] = useState(null);

  // Load
  useEffect(() => {
    const supabase = createClient();
  
    const loadData = async (sessionUser) => {
      if (!sessionUser) {
        setUser(null);
        setAuthLoaded(true);
        setLoaded(true);
        return;
      }
      setUser(sessionUser);
      setAuthLoaded(true);
      try {
        const data = await loadUserData(sessionUser.id);
        console.log('loaded data:', data);
        setState(data);
        if (data.onboarded) setScreen('dashboard');
      } catch (e) {
        console.error('Error loading user data:', e);
      }
      setLoaded(true);
    };
  
    supabase.auth.getSession().then(({ data: { session } }) => {
      loadData(session?.user ?? null);
    });
  
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'USER_UPDATED') {
        setUser(session?.user ?? null);
        return;
      }
      loadData(session?.user ?? null);
    });
  
    return () => subscription.unsubscribe();
  }, []);

  // Save
  const persist = async (next, user) => {
    setState(next);
    if (!user?.id) return;
    try {
      await saveProfile(user.id, user.email, {
        userType: next.userType,
        readingPath: next.readingPath,
        pace: next.pace,
      });
    } catch (e) {
      console.error('Error saving profile:', e);
    }
  };

  if (!authLoaded || !loaded) {
    return (
      <div style={{ minHeight: '100vh', background: '#091322', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C9A961', fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
        Loading...
      </div>
    );
  }
  
  if (!user) {
    return <AuthScreen onAuth={setUser} />;
  }

  /* ===== ONBOARDING ===== */
  
  if (screen === "onboarding") {
    return <Onboarding step={onboardingStep} setStep={setOnboardingStep} state={state} persist={(next) => persist(next, user)} setScreen={setScreen} transitioning={transitioning} setTransitioning={setTransitioning} />;
  }

  /* ===== DASHBOARD ===== */
  if (screen === "dashboard") {
    return <Dashboard state={state} persist={persist} setScreen={setScreen} setActiveEntryId={setActiveEntryId} user={user} />;
    }

  /* ===== ENTRY ===== */
  if (screen === "entry" && activeEntryId) {
    return <EntryView entryId={activeEntryId} state={state} persist={persist} setScreen={setScreen} user={user} />;
  }

  /* ===== NOTES ===== */
  if (screen === "notes") {
    return <NotesView state={state} setScreen={setScreen} setActiveEntryId={setActiveEntryId} />;
  }

  /* ===== BOOKMARKS ===== */
  if (screen === "bookmarks") {
    return <BookmarksView state={state} setScreen={setScreen} setActiveEntryId={setActiveEntryId} />;
  }

  /* ===== SETTINGS ===== */
  if (screen === "profile") {
    return <ProfileView state={state} setState={setState} user={user} setScreen={setScreen} />;
  }
  if (screen === "settings") {
    return <SettingsView state={state} persist={persist} setScreen={setScreen} setOnboardingStep={setOnboardingStep} user={user} setUser={setUser} />;
  }

  return null;
}

/* ============ ONBOARDING ============ */

function Onboarding({ step, setStep, state, persist, setScreen, transitioning, setTransitioning }) {
  const [draft, setDraft] = useState({
    userType: state.userType,
    readingPath: state.readingPath,
    pace: state.pace,
  });

  const proceed = () => {
    setTransitioning(true);
    setTimeout(() => {
      if (step < 2) setStep(step + 1);
      else {
        const next = {
          ...state,
          ...draft,
          onboarded: true,
        };
        persist(next);
        setScreen("dashboard");
      }
      setTransitioning(false);
    }, 300);
  };

  const back = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <div style={{ minHeight: "100vh", background: COLORS.navyDeep, color: COLORS.cream, fontFamily: "Georgia, 'Times New Roman', serif" }}>
      {/* Top */}
      <div style={{ padding: "24px 20px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 6 }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ width: 28, height: 3, borderRadius: 2, background: i <= step ? COLORS.gold : COLORS.border, transition: "0.3s" }} />
          ))}
        </div>
        {step > 0 && (
          <button onClick={back} style={{ background: "none", border: "none", color: COLORS.muted, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
            Back
          </button>
        )}
      </div>

      <div style={{
  padding: "32px 20px 120px",
  maxWidth: 560,
  margin: "0 auto",
  opacity: transitioning ? 0 : 1,
  transform: transitioning ? 'translateY(12px)' : 'translateY(0)',
  transition: 'opacity 0.3s ease, transform 0.3s ease',
}}>
  {step === 0 && <Step0 draft={draft} setDraft={setDraft} />}
  {step === 1 && <Step1 draft={draft} setDraft={setDraft} />}
  {step === 2 && <Step2 draft={draft} setDraft={setDraft} />}
</div>

      {/* Continue */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, padding: "16px 20px 28px", background: "linear-gradient(to top, " + COLORS.navyDeep + " 80%, transparent)" }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <button
            onClick={proceed}
            disabled={(step === 0 && !draft.userType) || (step === 1 && !draft.readingPath) || (step === 2 && !draft.pace)}
            style={{
              width: "100%",
              padding: "16px",
              background: ((step === 0 && draft.userType) || (step === 1 && draft.readingPath) || (step === 2 && draft.pace)) ? COLORS.gold : COLORS.border,
              color: ((step === 0 && draft.userType) || (step === 1 && draft.readingPath) || (step === 2 && draft.pace)) ? COLORS.navyDeep : COLORS.muted,
              border: "none",
              borderRadius: 8,
              fontFamily: "Georgia, serif",
              fontSize: 15,
              fontWeight: 700,
              letterSpacing: 1.5,
              cursor: "pointer",
              textTransform: "uppercase",
              transition: "0.2s",
            }}
          >
            {step < 2 ? "Continue" : "Begin"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Step0({ draft, setDraft }) {
  return (
    <div>
      <div style={{ fontSize: 11, letterSpacing: 4, color: COLORS.gold, textTransform: "uppercase", fontFamily: "Helvetica, sans-serif", marginBottom: 8 }}>Step 1 of 3</div>
      <h1 style={{ margin: "0 0 12px", fontSize: 32, fontWeight: 400, lineHeight: 1.2, letterSpacing: -0.5 }}>Who are you?</h1>
      <p style={{ margin: "0 0 32px", color: COLORS.muted, fontSize: 15, lineHeight: 1.6 }}>This becomes your identity in the Builder's Bible community.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {USER_TYPES.map((u) => {
          const sel = draft.userType === u.id;
          return (
            <button
              key={u.id}
              onClick={() => setDraft({ ...draft, userType: u.id })}
              style={{
                padding: "16px 18px",
                background: sel ? COLORS.charcoalLight : COLORS.charcoal,
                border: sel ? "1px solid " + COLORS.gold : "1px solid " + COLORS.border,
                borderRadius: 10,
                textAlign: "left",
                cursor: "pointer",
                color: COLORS.cream,
                fontFamily: "inherit",
                transition: "0.15s",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: sel ? COLORS.gold : COLORS.cream, marginBottom: 3 }}>{u.label}</div>
                  <div style={{ fontSize: 13, color: COLORS.muted, fontStyle: "italic" }}>{u.desc}</div>
                </div>
                {sel && <Check size={18} color={COLORS.gold} />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Step1({ draft, setDraft }) {
  return (
    <div>
      <div style={{ fontSize: 11, letterSpacing: 4, color: COLORS.gold, textTransform: "uppercase", fontFamily: "Helvetica, sans-serif", marginBottom: 8 }}>Step 2 of 3</div>
      <h1 style={{ margin: "0 0 12px", fontSize: 32, fontWeight: 400, lineHeight: 1.2, letterSpacing: -0.5 }}>How do you want to read?</h1>
      <p style={{ margin: "0 0 28px", color: COLORS.muted, fontSize: 15, lineHeight: 1.6 }}>Each path is a different way of moving through scripture. Pick the one that fits how you think.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {READING_PATHS.map((p) => {
          const sel = draft.readingPath === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setDraft({ ...draft, readingPath: p.id })}
              style={{
                padding: "18px 20px",
                background: sel ? COLORS.charcoalLight : COLORS.charcoal,
                border: sel ? "1px solid " + COLORS.gold : "1px solid " + COLORS.border,
                borderRadius: 10,
                textAlign: "left",
                cursor: "pointer",
                color: COLORS.cream,
                fontFamily: "inherit",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 17, fontWeight: 700, color: sel ? COLORS.gold : COLORS.cream, marginBottom: 4 }}>{p.name}</div>
                  <div style={{ fontSize: 13, color: COLORS.goldSoft, fontStyle: "italic", marginBottom: 8 }}>{p.tagline}</div>
                  <div style={{ fontSize: 13, color: COLORS.muted, lineHeight: 1.6 }}>{p.description}</div>
                </div>
                {sel && <Check size={18} color={COLORS.gold} style={{ flexShrink: 0, marginTop: 2 }} />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Step2({ draft, setDraft }) {
  const path = READING_PATHS.find((p) => p.id === draft.readingPath);
  return (
    <div>
      <div style={{ fontSize: 11, letterSpacing: 4, color: COLORS.gold, textTransform: "uppercase", fontFamily: "Helvetica, sans-serif", marginBottom: 8 }}>Step 3 of 3</div>
      <h1 style={{ margin: "0 0 12px", fontSize: 32, fontWeight: 400, lineHeight: 1.2, letterSpacing: -0.5 }}>What is your pace?</h1>
      <p style={{ margin: "0 0 28px", color: COLORS.muted, fontSize: 15, lineHeight: 1.6 }}>Sustainable beats heroic. Pick what you can actually keep.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {PACES.map((pc) => {
          const sel = draft.pace === pc.id;
          const est = path ? calcEstimate(path.daysApprox, pc.multiplier) : null;
          return (
            <button
              key={pc.id}
              onClick={() => setDraft({ ...draft, pace: pc.id })}
              style={{
                padding: "18px 20px",
                background: sel ? COLORS.charcoalLight : COLORS.charcoal,
                border: sel ? "1px solid " + COLORS.gold : "1px solid " + COLORS.border,
                borderRadius: 10,
                textAlign: "left",
                cursor: "pointer",
                color: COLORS.cream,
                fontFamily: "inherit",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: sel ? COLORS.gold : COLORS.cream, marginBottom: 4 }}>{pc.name}</div>
                  <div style={{ fontSize: 13, color: COLORS.muted, lineHeight: 1.6, marginBottom: 8 }}>{pc.desc}</div>
                  {est && (
                    <div style={{ fontSize: 11, color: COLORS.goldSoft, letterSpacing: 1.5, textTransform: "uppercase", fontFamily: "Helvetica, sans-serif" }}>
                      Estimated finish: {est.years} years
                    </div>
                  )}
                </div>
                {sel && <Check size={18} color={COLORS.gold} style={{ flexShrink: 0, marginTop: 2 }} />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ============ DASHBOARD ============ */

function Dashboard({ state, persist, setScreen, setActiveEntryId, user }) {
  const path = READING_PATHS.find((p) => p.id === state.readingPath);
  const pace = PACES.find((p) => p.id === state.pace);
  const entries = getEntriesForPath(state.readingPath);
  const completedCount = state.completedDays.length;
  const totalDays = path ? Math.round(path.daysApprox * (pace ? pace.multiplier : 1)) : 365;
  const pct = Math.round((completedCount / totalDays) * 100);

  return (
    <div style={{ minHeight: "100vh", background: COLORS.navyDeep, color: COLORS.cream, fontFamily: "Georgia, serif", paddingBottom: 40 }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(180deg, " + COLORS.charcoal + ", " + COLORS.navyDeep + ")", padding: "24px 20px 28px", borderBottom: "1px solid " + COLORS.borderSoft }}>
        <div style={{ maxWidth: 560, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: 4, color: COLORS.goldSoft, textTransform: "uppercase", fontFamily: "Helvetica, sans-serif", marginBottom: 4 }}>The Builder's Bible</div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 400, color: COLORS.cream, letterSpacing: -0.3 }}>Today</h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", background: COLORS.charcoalLight, borderRadius: 999, border: "1px solid " + COLORS.border }}>
            <Flame size={14} color={COLORS.gold} />
            <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.gold }}>{state.streak}</span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 560, margin: "0 auto", padding: "20px 20px 0" }}>
        {/* Plan Overview */}
        <div style={{ background: COLORS.charcoal, border: "1px solid " + COLORS.border, borderRadius: 12, padding: "18px 20px", marginBottom: 20 }}>
          <div style={{ fontSize: 10, letterSpacing: 3, color: COLORS.goldSoft, textTransform: "uppercase", fontFamily: "Helvetica, sans-serif", marginBottom: 6 }}>Your Plan</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.cream, marginBottom: 2 }}>{path ? path.name : "--"}</div>
          <div style={{ fontSize: 13, color: COLORS.muted, fontStyle: "italic", marginBottom: 14 }}>{pace ? pace.name : "--"}</div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 11, color: COLORS.muted, letterSpacing: 1, textTransform: "uppercase", fontFamily: "Helvetica, sans-serif" }}>Progress</span>
            <span style={{ fontSize: 11, color: COLORS.goldSoft, letterSpacing: 1, fontFamily: "Helvetica, sans-serif" }}>{completedCount} / {totalDays} &middot; {pct}%</span>
          </div>
          <div style={{ background: COLORS.navyDeep, height: 4, borderRadius: 2, overflow: "hidden" }}>
            <div style={{ background: "linear-gradient(90deg, " + COLORS.goldDim + ", " + COLORS.gold + ")", width: pct + "%", height: "100%", transition: "width 0.5s" }} />
          </div>
        </div>

       {/* Today's Focus */}
{(() => {
  const allEntries = getEntriesForPath(state.readingPath);
  const completedSet = new Set(state.completedDays);
  const nextEntry = allEntries.find((e) => !completedSet.has(e.id));
  const upNextEntry = nextEntry ? allEntries[allEntries.indexOf(nextEntry) + 1] : null;
  const allDone = !nextEntry;

  if (allDone) {
    return (
      <div style={{
        background: "linear-gradient(135deg, #1A2238, #222C45)",
        border: "1px solid " + COLORS.gold,
        borderRadius: 16, padding: "32px 24px", textAlign: "center",
        boxShadow: "0 4px 32px rgba(201, 169, 97, 0.15)",
      }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>🙏</div>
        <div style={{ fontSize: 10, letterSpacing: 4, color: COLORS.gold, textTransform: "uppercase", fontFamily: "Helvetica, sans-serif", marginBottom: 10 }}>You finished this path</div>
        <h2 style={{ margin: "0 0 12px", fontSize: 22, fontWeight: 400, color: COLORS.cream, lineHeight: 1.3 }}>
          Well done, good and faithful servant.
        </h2>
        <p style={{ margin: "0 0 20px", fontSize: 14, color: COLORS.muted, lineHeight: 1.7, fontStyle: "italic" }}>
          "Let us not become weary in doing good, for at the proper time we will reap a harvest if we do not give up." — Galatians 6:9
        </p>
        <div style={{ width: 40, height: 1, background: COLORS.goldDim, margin: "0 auto 20px" }} />
        <p style={{ margin: 0, fontSize: 13, color: COLORS.muted, lineHeight: 1.6 }}>
          More content is on the way. Keep your notes and bookmarks -- your journey here is saved.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Today label */}
      <div style={{ fontSize: 10, letterSpacing: 3, color: COLORS.goldSoft, textTransform: "uppercase", fontFamily: "Helvetica, sans-serif", marginBottom: 10 }}>
        Today's Focus
      </div>

      {/* Main entry card */}
      <button
        onClick={() => { setActiveEntryId(nextEntry.id); setScreen("entry"); }}
        style={{
          width: "100%",
          background: "linear-gradient(135deg, " + COLORS.charcoal + ", " + COLORS.charcoalLight + ")",
          border: "1px solid " + COLORS.gold,
          borderRadius: 16, padding: "22px 20px",
          textAlign: "left", cursor: "pointer",
          color: COLORS.cream, fontFamily: "inherit",
          boxShadow: "0 4px 24px rgba(201, 169, 97, 0.1)",
          marginBottom: 12,
          display: "block",
        }}
      >
        {nextEntry.trackName && (
          <div style={{ fontSize: 10, letterSpacing: 3, color: COLORS.gold, textTransform: "uppercase", fontFamily: "Helvetica, sans-serif", marginBottom: 6 }}>
            {nextEntry.trackName}
          </div>
        )}
        <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.cream, marginBottom: 8, lineHeight: 1.3 }}>
          {nextEntry.reading}
        </div>
        <div style={{ fontSize: 14, color: COLORS.muted, fontStyle: "italic", lineHeight: 1.6, marginBottom: 16 }}>
          {nextEntry.hook}
        </div>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: COLORS.gold, color: COLORS.navyDeep,
          padding: "8px 16px", borderRadius: 999,
          fontSize: 11, fontWeight: 700, letterSpacing: 2,
          textTransform: "uppercase", fontFamily: "Helvetica, sans-serif",
        }}>
          Open Today's Reading
          <ArrowRight size={13} />
        </div>
      </button>

      {/* Up Next */}
      {upNextEntry && (
        <div>
          <div style={{ fontSize: 10, letterSpacing: 3, color: COLORS.muted, textTransform: "uppercase", fontFamily: "Helvetica, sans-serif", marginBottom: 8 }}>
            Up Next
          </div>
          <button
            onClick={() => { setActiveEntryId(upNextEntry.id); setScreen("entry"); }}
            style={{
              width: "100%",
              background: COLORS.charcoal,
              border: "1px solid " + COLORS.border,
              borderRadius: 12, padding: "14px 16px",
              textAlign: "left", cursor: "pointer",
              color: COLORS.cream, fontFamily: "inherit",
              display: "flex", alignItems: "center", gap: 12,
              opacity: 0.75,
            }}
          >
            <div style={{ flex: 1 }}>
              {upNextEntry.trackName && (
                <div style={{ fontSize: 9, letterSpacing: 2, color: COLORS.goldSoft, textTransform: "uppercase", fontFamily: "Helvetica, sans-serif", marginBottom: 3 }}>
                  {upNextEntry.trackName}
                </div>
              )}
              <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.cream, marginBottom: 3 }}>
                {upNextEntry.reading}
              </div>
              <div style={{ fontSize: 12, color: COLORS.muted, fontStyle: "italic", lineHeight: 1.5 }}>
                {upNextEntry.hook}
              </div>
            </div>
            <ArrowRight size={14} color={COLORS.muted} />
          </button>
        </div>
      )}
    </div>
  );
})()}

        {/* Footer Nav */}
        <div style={{ marginTop: 28, paddingTop: 20, borderTop: "1px solid " + COLORS.borderSoft, display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
  <NavButton icon={<NotebookPen size={16} />} label="Notes" onClick={() => setScreen("notes")} count={Object.keys(state.notes).length} />
  <NavButton icon={<Bookmark size={16} />} label="Saved" onClick={() => setScreen("bookmarks")} count={state.bookmarks.length} />
  <NavButton icon={<User size={16} />} label="Profile" onClick={() => setScreen("profile")} />
  <NavButton icon={<Settings size={16} />} label="Settings" onClick={() => setScreen("settings")} />
</div>
      </div>
    </div>
  );
}

function NavButton({ icon, label, onClick, count }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: COLORS.charcoal,
        border: "1px solid " + COLORS.border,
        borderRadius: 10,
        padding: "12px 8px",
        cursor: "pointer",
        color: COLORS.cream,
        fontFamily: "Georgia, serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 5,
      }}
    >
      <div style={{ color: COLORS.gold }}>{icon}</div>
      <div style={{ fontSize: 11, letterSpacing: 2, color: COLORS.muted, textTransform: "uppercase", fontFamily: "Helvetica, sans-serif" }}>
        {label}{count !== undefined && count > 0 ? " (" + count + ")" : ""}
      </div>
    </button>
  );
}

/* ============ ENTRY VIEW ============ */

function EntryView({ entryId, state, persist, setScreen, user }) {
  const allEntries = Object.values(ENTRIES).flat();
  const entry = allEntries.find((e) => e.id === entryId);
  if (!entry) return null;

  const unlocked = state.unlockedDays.includes(entry.id);
  const completed = state.completedDays.includes(entry.id);
  const bookmarked = state.bookmarks.includes(entry.id);
  const [noteText, setNoteText] = useState(state.notes[entry.id] || "");

  const unlock = async () => {
    const next = { ...state, unlockedDays: [...state.unlockedDays, entry.id] };
    persist(next, user);
    if (user?.id) await unlockDay(user.id, entry.id);
  };

  const toggleComplete = async () => {
    const today = new Date().toDateString();
    let newStreak = state.streak;
    let newCompleted;
    if (completed) {
      newCompleted = state.completedDays.filter((id) => id !== entry.id);
    } else {
      newCompleted = [...state.completedDays, entry.id];
      if (state.lastCompleted !== today) newStreak = state.streak + 1;
    }
    const next = { ...state, completedDays: newCompleted, streak: newStreak, lastCompleted: today };
    persist(next, user);
    if (user?.id) {
      await completeDay(user.id, entry.id, !completed);
      await saveStreak(user.id, newStreak, today);
    }
  };

  const toggleBookmark = async () => {
    const next = bookmarked
      ? state.bookmarks.filter((id) => id !== entry.id)
      : [...state.bookmarks, entry.id];
    const nextState = { ...state, bookmarks: next };
    persist(nextState, user);
    if (user?.id) await toggleBookmarkDB(user.id, entry.id, !bookmarked);
  };

  const saveNote = async (text) => {
    setNoteText(text);
    const next = { ...state.notes };
    if (text.trim()) next[entry.id] = text;
    else delete next[entry.id];
    persist({ ...state, notes: next }, user);
    if (user?.id) await saveNoteDB(user.id, entry.id, text);
  };
  return (
    <div style={{ minHeight: "100vh", background: COLORS.navyDeep, color: COLORS.cream, fontFamily: "Georgia, serif" }}>
      {/* Top bar */}
      <div style={{ position: "sticky", top: 0, background: COLORS.navyDeep, borderBottom: "1px solid " + COLORS.borderSoft, padding: "16px 20px", zIndex: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button onClick={() => setScreen("dashboard")} style={{ background: "none", border: "none", color: COLORS.gold, fontFamily: "inherit", fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
          <ChevronLeft size={18} /> Back
        </button>
        <button onClick={toggleBookmark} style={{ background: "none", border: "none", color: bookmarked ? COLORS.gold : COLORS.muted, cursor: "pointer", padding: 4 }}>
          <Bookmark size={20} fill={bookmarked ? COLORS.gold : "none"} />
        </button>
      </div>

      <div style={{ maxWidth: 560, margin: "0 auto", padding: "24px 20px 60px" }}>
        {/* Track label */}
        {entry.trackName && (
          <div style={{ fontSize: 10, letterSpacing: 4, color: COLORS.gold, textTransform: "uppercase", fontFamily: "Helvetica, sans-serif", marginBottom: 8 }}>{entry.trackName}</div>
        )}

        {/* Reading reference */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 10, letterSpacing: 3, color: COLORS.goldSoft, textTransform: "uppercase", fontFamily: "Helvetica, sans-serif", marginBottom: 6 }}>Today's Reading</div>
          <h1 style={{ margin: 0, fontSize: 30, fontWeight: 400, color: COLORS.cream, letterSpacing: -0.3, lineHeight: 1.2 }}>{entry.reading}</h1>
        </div>

        {/* Hook */}
        <div style={{ background: "linear-gradient(135deg, " + COLORS.charcoal + ", " + COLORS.charcoalLight + ")", borderLeft: "3px solid " + COLORS.gold, borderRadius: "0 10px 10px 0", padding: "16px 18px", marginBottom: 24 }}>
          <p style={{ margin: 0, fontSize: 16, lineHeight: 1.6, color: COLORS.cream, fontStyle: "italic", fontFamily: "Georgia, serif" }}>{entry.hook}</p>
        </div>

        {!unlocked ? (
          /* Locked state */
          <div>
            <div style={{ position: "relative", marginBottom: 20 }}>
              {/* Preview cards */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12, opacity: 0.35, filter: "blur(2px)", pointerEvents: "none" }}>
                <PreviewCard label="Historical Context" text={entry.contextPreview} />
                <PreviewCard label="Key Principle" text={entry.principlePreview} />
                <PreviewCard label="Deep Dive" text="Locked content will appear here..." />
              </div>
              {/* Lock overlay */}
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
                <div style={{ background: COLORS.charcoalLight, border: "1px solid " + COLORS.gold, borderRadius: 999, padding: "8px 14px", display: "flex", alignItems: "center", gap: 6 }}>
                  <Lock size={13} color={COLORS.gold} />
                  <span style={{ fontSize: 11, letterSpacing: 2, color: COLORS.gold, textTransform: "uppercase", fontFamily: "Helvetica, sans-serif" }}>Read first</span>
                </div>
              </div>
            </div>

            <button
              onClick={unlock}
              style={{
                width: "100%",
                padding: "18px",
                background: "linear-gradient(135deg, " + COLORS.gold + ", " + COLORS.goldSoft + ")",
                color: COLORS.navyDeep,
                border: "none",
                borderRadius: 10,
                fontFamily: "Georgia, serif",
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: 2,
                cursor: "pointer",
                textTransform: "uppercase",
                boxShadow: "0 4px 20px rgba(201, 169, 97, 0.2)",
              }}
            >
              I have read it
            </button>
            <p style={{ margin: "12px 0 0", fontSize: 12, color: COLORS.muted, textAlign: "center", fontStyle: "italic" }}>
              Open your Bible. Read the passage. Then tap to unlock the reflection.
            </p>
          </div>
        ) : (
          /* Unlocked state */
          <div style={{ animation: "fadeIn 0.5s ease" }}>
            <Section label="Historical Context" text={entry.context} />
            <Section label="Key Principle" text={entry.principle} highlight />
            <Section label="Deep Dive" text={entry.deepDive} />
            <Section label="Entrepreneur Application" text={entry.application} />

            {/* Question */}
            <div style={{ background: COLORS.charcoal, border: "1px solid " + COLORS.goldDim, borderRadius: 12, padding: "18px 20px", marginBottom: 16 }}>
              <div style={{ fontSize: 10, letterSpacing: 3, color: COLORS.gold, textTransform: "uppercase", fontFamily: "Helvetica, sans-serif", marginBottom: 8 }}>Sit With This</div>
              <p style={{ margin: 0, fontSize: 15, lineHeight: 1.7, color: COLORS.cream, fontStyle: "italic" }}>{entry.question}</p>
            </div>

            {/* Prayer */}
            <div style={{ background: "linear-gradient(135deg, " + COLORS.charcoal + ", " + COLORS.charcoalLight + ")", border: "1px solid " + COLORS.border, borderRadius: 12, padding: "18px 20px", marginBottom: 24 }}>
              <div style={{ fontSize: 10, letterSpacing: 3, color: COLORS.goldSoft, textTransform: "uppercase", fontFamily: "Helvetica, sans-serif", marginBottom: 8 }}>Closing Prayer</div>
              <p style={{ margin: 0, fontSize: 15, lineHeight: 1.7, color: COLORS.cream }}>{entry.prayer}</p>
            </div>

            {/* Notes */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 10, letterSpacing: 3, color: COLORS.goldSoft, textTransform: "uppercase", fontFamily: "Helvetica, sans-serif", marginBottom: 8 }}>Your Notes</div>
              <textarea
                value={noteText}
                onChange={(e) => saveNote(e.target.value)}
                placeholder="Reflections, questions, what stood out to you..."
                style={{
                  width: "100%",
                  minHeight: 100,
                  background: COLORS.charcoal,
                  border: "1px solid " + COLORS.border,
                  borderRadius: 10,
                  padding: "12px 14px",
                  color: COLORS.cream,
                  fontFamily: "Georgia, serif",
                  fontSize: 14,
                  lineHeight: 1.6,
                  resize: "vertical",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Mark complete */}
            <button
              onClick={toggleComplete}
              style={{
                width: "100%",
                padding: "16px",
                background: completed ? COLORS.gold : "transparent",
                color: completed ? COLORS.navyDeep : COLORS.gold,
                border: "1px solid " + COLORS.gold,
                borderRadius: 10,
                fontFamily: "Georgia, serif",
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: 2,
                cursor: "pointer",
                textTransform: "uppercase",
              }}
            >
              {completed ? "✓ Completed" : "Mark Day Complete"}
            </button>
          </div>
        )}
      </div>
      <style>{"@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }"}</style>
    </div>
  );
}

function PreviewCard({ label, text }) {
  return (
    <div style={{ background: COLORS.charcoal, border: "1px solid " + COLORS.border, borderRadius: 10, padding: "14px 16px" }}>
      <div style={{ fontSize: 10, letterSpacing: 3, color: COLORS.goldSoft, textTransform: "uppercase", fontFamily: "Helvetica, sans-serif", marginBottom: 6 }}>{label}</div>
      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: COLORS.cream }}>{text}</p>
    </div>
  );
}

function Section({ label, text, highlight }) {
  return (
    <div style={{
      background: highlight ? "linear-gradient(135deg, " + COLORS.charcoalLight + ", " + COLORS.charcoal + ")" : COLORS.charcoal,
      border: highlight ? "1px solid " + COLORS.goldDim : "1px solid " + COLORS.border,
      borderRadius: 12,
      padding: "16px 18px",
      marginBottom: 12,
    }}>
      <div style={{ fontSize: 10, letterSpacing: 3, color: highlight ? COLORS.gold : COLORS.goldSoft, textTransform: "uppercase", fontFamily: "Helvetica, sans-serif", marginBottom: 8 }}>{label}</div>
      <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.75, color: COLORS.cream }}>{text}</p>
    </div>
  );
}

/* ============ NOTES VIEW ============ */

function NotesView({ state, setScreen, setActiveEntryId }) {
  const allEntries = Object.values(ENTRIES).flat();
  const noteEntries = Object.keys(state.notes).map((id) => allEntries.find((e) => e.id === id)).filter(Boolean);

  return (
    <div style={{ minHeight: "100vh", background: COLORS.navyDeep, color: COLORS.cream, fontFamily: "Georgia, serif" }}>
      <TopBar title="My Notes" onBack={() => setScreen("dashboard")} />
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "20px 20px 40px" }}>
        {noteEntries.length === 0 ? (
          <EmptyState text="No notes yet. Reflections you write inside an entry will appear here." />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {noteEntries.map((e) => (
              <button
                key={e.id}
                onClick={() => { setActiveEntryId(e.id); setScreen("entry"); }}
                style={{ background: COLORS.charcoal, border: "1px solid " + COLORS.border, borderRadius: 10, padding: "14px 16px", textAlign: "left", cursor: "pointer", color: COLORS.cream, fontFamily: "inherit" }}
              >
                <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.cream, marginBottom: 4 }}>{e.reading}</div>
                <div style={{ fontSize: 13, color: COLORS.muted, fontStyle: "italic", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{state.notes[e.id]}</div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ============ BOOKMARKS VIEW ============ */

function BookmarksView({ state, setScreen, setActiveEntryId }) {
  const allEntries = Object.values(ENTRIES).flat();
  const saved = state.bookmarks.map((id) => allEntries.find((e) => e.id === id)).filter(Boolean);

  return (
    <div style={{ minHeight: "100vh", background: COLORS.navyDeep, color: COLORS.cream, fontFamily: "Georgia, serif" }}>
      <TopBar title="Saved" onBack={() => setScreen("dashboard")} />
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "20px 20px 40px" }}>
        {saved.length === 0 ? (
          <EmptyState text="No bookmarks yet. Tap the bookmark icon inside an entry to save it." />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {saved.map((e) => (
              <button
                key={e.id}
                onClick={() => { setActiveEntryId(e.id); setScreen("entry"); }}
                style={{ background: COLORS.charcoal, border: "1px solid " + COLORS.border, borderRadius: 10, padding: "14px 16px", textAlign: "left", cursor: "pointer", color: COLORS.cream, fontFamily: "inherit" }}
              >
                {e.trackName && <div style={{ fontSize: 10, letterSpacing: 2, color: COLORS.goldSoft, textTransform: "uppercase", fontFamily: "Helvetica, sans-serif", marginBottom: 3 }}>{e.trackName}</div>}
                <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.cream, marginBottom: 4 }}>{e.reading}</div>
                <div style={{ fontSize: 13, color: COLORS.muted, fontStyle: "italic", lineHeight: 1.5 }}>{e.hook}</div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ============ SETTINGS ============ */

function ProfileView({ state, setState, user, setScreen }) {
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(user?.user_metadata?.full_name || "");
  const [editRole, setEditRole] = useState(state.userType || "");
  const [saving, setSaving] = useState(false);

  const path = READING_PATHS.find((p) => p.id === state.readingPath);
  const pace = PACES.find((p) => p.id === state.pace);
  const userType = USER_TYPES.find((u) => u.id === state.userType);

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "--";

  const initials = (user?.user_metadata?.full_name || user?.email || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

    const handleSave = async () => {
      setSaving(true);
      try {
        const supabase = createClient();
        await supabase.auth.updateUser({ data: { full_name: editName } });
        await saveProfile(user.id, user.email, {
          userType: editRole,
          readingPath: state.readingPath,
          pace: state.pace,
        });
        setState({ ...state, userType: editRole });
        user.user_metadata.full_name = editName;
      } catch (e) {
        console.error("Error saving profile:", e);
      }
      setSaving(false);
      setEditing(false);
    };

  return (
    <div style={{ minHeight: "100vh", background: COLORS.navyDeep, color: COLORS.cream, fontFamily: "Georgia, serif" }}>
      <div style={{ position: "sticky", top: 0, background: COLORS.navyDeep, borderBottom: "1px solid " + COLORS.borderSoft, padding: "16px 20px", zIndex: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button onClick={() => setScreen("dashboard")} style={{ background: "none", border: "none", color: COLORS.gold, fontFamily: "inherit", fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
          <ChevronLeft size={18} /> Back
        </button>
        <div style={{ fontSize: 18, fontWeight: 400, color: COLORS.cream }}>Profile</div>
        <button onClick={() => setEditing(!editing)} style={{ background: "none", border: "none", color: COLORS.gold, cursor: "pointer", padding: 4 }}>
          <Edit2 size={18} />
        </button>
      </div>

      <div style={{ maxWidth: 560, margin: "0 auto", padding: "32px 20px 48px" }}>

        {/* Avatar and name */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            width: 80, height: 80, borderRadius: "50%",
            background: "linear-gradient(135deg, " + COLORS.gold + ", " + COLORS.goldSoft + ")",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px",
            fontSize: 28, fontWeight: 700, color: COLORS.navyDeep,
            fontFamily: "Helvetica, sans-serif",
          }}>
            {initials}
          </div>
          {!editing ? (
            <>
              <div style={{ fontSize: 22, fontWeight: 400, color: COLORS.cream, marginBottom: 4 }}>
                {user?.user_metadata?.full_name || "No name set"}
              </div>
              <div style={{ fontSize: 13, color: COLORS.goldSoft, fontStyle: "italic" }}>
                {userType?.label || "--"}
              </div>
              <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 4, fontFamily: "Helvetica, sans-serif", letterSpacing: 1 }}>
                Member since {memberSince}
              </div>
            </>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 320, margin: "0 auto" }}>
              <div>
                <div style={{ fontSize: 10, letterSpacing: 3, color: COLORS.muted, textTransform: "uppercase", fontFamily: "Helvetica, sans-serif", marginBottom: 6, textAlign: "left" }}>Name</div>
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  style={{ width: "100%", padding: "12px 14px", background: COLORS.charcoal, border: "1px solid " + COLORS.border, borderRadius: 8, color: COLORS.cream, fontFamily: "Georgia, serif", fontSize: 14, outline: "none", boxSizing: "border-box" }}
                />
              </div>
              <div>
                <div style={{ fontSize: 10, letterSpacing: 3, color: COLORS.muted, textTransform: "uppercase", fontFamily: "Helvetica, sans-serif", marginBottom: 6, textAlign: "left" }}>Role</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {USER_TYPES.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => setEditRole(u.id)}
                      style={{
                        padding: "10px 14px", borderRadius: 8, border: editRole === u.id ? "1px solid " + COLORS.gold : "1px solid " + COLORS.border,
                        background: editRole === u.id ? COLORS.charcoalLight : COLORS.charcoal,
                        color: editRole === u.id ? COLORS.gold : COLORS.cream,
                        fontFamily: "Georgia, serif", fontSize: 13, cursor: "pointer", textAlign: "left",
                      }}
                    >
                      {u.label}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={handleSave}
                disabled={saving}
                style={{ padding: "13px", background: "linear-gradient(135deg, " + COLORS.gold + ", " + COLORS.goldSoft + ")", color: COLORS.navyDeep, border: "none", borderRadius: 8, fontFamily: "Georgia, serif", fontSize: 13, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", cursor: "pointer" }}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
          <StatCard label="Current Streak" value={state.streak + " days"} />
          <StatCard label="Days Completed" value={state.completedDays.length} />
        </div>

        {/* Reading plan */}
        <div style={{ background: COLORS.charcoal, border: "1px solid " + COLORS.border, borderRadius: 12, padding: "18px 20px" }}>
          <div style={{ fontSize: 10, letterSpacing: 3, color: COLORS.goldSoft, textTransform: "uppercase", fontFamily: "Helvetica, sans-serif", marginBottom: 12 }}>Reading Plan</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13, color: COLORS.muted }}>Path</span>
              <span style={{ fontSize: 13, color: COLORS.cream }}>{path?.name || "--"}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13, color: COLORS.muted }}>Pace</span>
              <span style={{ fontSize: 13, color: COLORS.cream }}>{pace?.name || "--"}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13, color: COLORS.muted }}>Email</span>
              <span style={{ fontSize: 13, color: COLORS.cream }}>{user?.email}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div style={{ background: COLORS.charcoal, border: "1px solid " + COLORS.border, borderRadius: 12, padding: "16px 18px", textAlign: "center" }}>
      <div style={{ fontSize: 24, fontWeight: 700, color: COLORS.gold, marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 10, letterSpacing: 2, color: COLORS.muted, textTransform: "uppercase", fontFamily: "Helvetica, sans-serif" }}>{label}</div>
    </div>
  );
}

function SettingsView({ state, persist, setScreen, setOnboardingStep, user, setUser }) {
  const path = READING_PATHS.find((p) => p.id === state.readingPath);
  const pace = PACES.find((p) => p.id === state.pace);
  const userType = USER_TYPES.find((u) => u.id === state.userType);

  const reset = () => {
    if (confirm("Reset all progress and start over? This cannot be undone.")) {
      const fresh = {
        onboarded: false, userType: null, readingPath: null, pace: null,
        completedDays: [], unlockedDays: [], notes: {}, bookmarks: [],
        streak: 0, lastCompleted: null,
      };
      persist(fresh, user);
      setOnboardingStep(0);
      setScreen("onboarding");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: COLORS.navyDeep, color: COLORS.cream, fontFamily: "Georgia, serif" }}>
      <TopBar title="Settings" onBack={() => setScreen("dashboard")} />
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "20px 20px 40px" }}>
        <SettingRow label="Role" value={userType ? userType.label : "--"} />
        <SettingRow label="Reading Path" value={path ? path.name : "--"} />
        <SettingRow label="Pace" value={pace ? pace.name : "--"} />
        <SettingRow label="Streak" value={state.streak + " days"} />
        <SettingRow label="Days Completed" value={state.completedDays.length} />

        <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 10 }}>

          <div style={{ background: COLORS.charcoal, border: "1px solid " + COLORS.border, borderRadius: 10, padding: "16px 18px" }}>
            <div style={{ fontSize: 10, letterSpacing: 3, color: COLORS.goldSoft, textTransform: "uppercase", fontFamily: "Helvetica, sans-serif", marginBottom: 10 }}>Account</div>
            <div style={{ fontSize: 14, color: COLORS.cream, marginBottom: 4 }}>{user?.user_metadata?.full_name || "No name set"}</div>
            <div style={{ fontSize: 13, color: COLORS.muted }}>{user?.email}</div>
          </div>

          <button
            onClick={async () => {
              const supabase = createClient();
              await supabase.auth.signOut();
              setUser(null);
              setScreen("onboarding");
            }}
            style={{
              width: "100%", padding: "14px", background: "transparent",
              color: COLORS.gold, border: "1px solid " + COLORS.gold,
              borderRadius: 8, fontFamily: "Georgia, serif", fontSize: 13,
              fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Log Out
          </button>

          <div style={{ background: COLORS.charcoal, border: "1px solid " + COLORS.border, borderRadius: 10, padding: "16px 18px" }}>
            <div style={{ fontSize: 13, color: COLORS.muted, lineHeight: 1.6, marginBottom: 12 }}>
              Want to switch your reading path or pace? Reset will take you back through onboarding.
            </div>
            <button
              onClick={reset}
              style={{
                width: "100%", padding: "12px", background: "transparent",
                color: "#D88A8A", border: "1px solid #5A2A2A",
                borderRadius: 8, fontFamily: "Georgia, serif", fontSize: 13,
                fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              Reset Progress
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

function SettingRow({ label, value }) {
  return (
    <div style={{ background: COLORS.charcoal, border: "1px solid " + COLORS.border, borderRadius: 10, padding: "14px 16px", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ fontSize: 11, letterSpacing: 2, color: COLORS.muted, textTransform: "uppercase", fontFamily: "Helvetica, sans-serif" }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.gold }}>{value}</div>
    </div>
  );
}

/* ============ SHARED ============ */

function TopBar({ title, onBack }) {
  return (
    <div style={{ position: "sticky", top: 0, background: COLORS.navyDeep, borderBottom: "1px solid " + COLORS.borderSoft, padding: "16px 20px", zIndex: 10, display: "flex", alignItems: "center", gap: 12 }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: COLORS.gold, cursor: "pointer", padding: 4, display: "flex", alignItems: "center" }}>
        <ChevronLeft size={20} />
      </button>
      <div style={{ fontSize: 18, fontWeight: 400, color: COLORS.cream, letterSpacing: -0.2 }}>{title}</div>
    </div>
  );
}

function EmptyState({ text }) {
  return (
    <div style={{ textAlign: "center", padding: "60px 20px", color: COLORS.muted, fontStyle: "italic", fontSize: 14, lineHeight: 1.7 }}>
      {text}
    </div>
  );
}

function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState('welcome');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSignUp = async () => {
    if (!email || !password || !fullName) { setError('Please fill in all fields.'); return; }
    setLoading(true); setError('');
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email, password, options: { data: { full_name: fullName } }
    });
    if (error) { setError(error.message); }
    else { setMessage('Check your email to confirm your account, then log in.'); setMode('confirm'); }
    setLoading(false);
  };

  const handleSignIn = async () => {
    if (!email || !password) { setError('Please enter your email and password.'); return; }
    setLoading(true); setError('');
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); }
    else { onAuth(data.user); }
    setLoading(false);
  };

  const handleForgotPassword = async () => {
    if (!email) { setError('Enter your email above first.'); return; }
    setLoading(true); setError('');
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) { setError(error.message); }
    else { setMessage('Password reset email sent. Check your inbox.'); }
    setLoading(false);
  };

  const aBtn = {
    width: '100%', padding: '15px',
    background: 'linear-gradient(135deg, #C9A961, #D4B870)',
    color: '#091322', border: 'none', borderRadius: 8,
    fontFamily: 'Georgia, serif', fontSize: 14, fontWeight: 700,
    letterSpacing: 1.5, textTransform: 'uppercase', cursor: 'pointer',
  };
  const oBtn = {
    width: '100%', padding: '15px', background: 'transparent',
    color: '#C9A961', border: '1px solid #C9A961', borderRadius: 8,
    fontFamily: 'Georgia, serif', fontSize: 14, fontWeight: 700,
    letterSpacing: 1.5, textTransform: 'uppercase', cursor: 'pointer',
  };
  const gBtn = {
    width: '100%', padding: '10px', background: 'transparent',
    border: 'none', color: '#8B92A8', fontFamily: 'Helvetica, sans-serif',
    fontSize: 13, cursor: 'pointer', textAlign: 'center',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#091322', color: '#F5F1E8', fontFamily: 'Georgia, serif', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 20px' }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 11, letterSpacing: 4, color: '#C9A961', textTransform: 'uppercase', fontFamily: 'Helvetica, sans-serif', marginBottom: 8 }}>The Builder's Bible</div>
          <h1 style={{ margin: 0, fontSize: 32, fontWeight: 400, color: '#F5F1E8', letterSpacing: -0.5 }}>
            {mode === 'welcome' && 'Welcome'}
            {mode === 'signup' && 'Create Account'}
            {mode === 'signin' && 'Welcome Back'}
            {mode === 'confirm' && 'Check Your Email'}
            {mode === 'forgot' && 'Reset Password'}
          </h1>
          <div style={{ width: 40, height: 2, background: '#C9A961', margin: '12px auto 0' }} />
        </div>

        {mode === 'confirm' && (
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#8B92A8', fontSize: 15, lineHeight: 1.7, marginBottom: 28 }}>{message}</p>
            <button onClick={() => setMode('signin')} style={aBtn}>Go to Login</button>
          </div>
        )}

        {mode === 'welcome' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <p style={{ color: '#8B92A8', fontSize: 15, lineHeight: 1.7, textAlign: 'center', marginBottom: 8, fontStyle: 'italic' }}>Scripture built for the way you build.</p>
            <button onClick={() => setMode('signup')} style={aBtn}>Create Account</button>
            <button onClick={() => setMode('signin')} style={oBtn}>Log In</button>
          </div>
        )}

        {mode === 'signup' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[['Full Name', fullName, setFullName, 'Patrick Rodriguez', 'text'], ['Email', email, setEmail, 'you@example.com', 'email'], ['Password', password, setPassword, 'Min. 6 characters', 'password']].map(([label, val, setter, ph, type]) => (
              <div key={label}>
                <div style={{ fontSize: 10, letterSpacing: 3, color: '#8B92A8', textTransform: 'uppercase', fontFamily: 'Helvetica, sans-serif', marginBottom: 6 }}>{label}</div>
                <input type={type} value={val} onChange={e => setter(e.target.value)} placeholder={ph} style={{ width: '100%', padding: '13px 14px', background: '#1A2238', border: '1px solid #2A3450', borderRadius: 8, color: '#F5F1E8', fontFamily: 'Georgia, serif', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
              </div>
            ))}
            {error && <div style={{ background: 'rgba(200,80,80,0.1)', border: '1px solid rgba(200,80,80,0.3)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#E88A8A' }}>{error}</div>}
            <button onClick={handleSignUp} disabled={loading} style={aBtn}>{loading ? 'Creating...' : 'Create Account'}</button>
            <button onClick={() => { setMode('welcome'); setError(''); }} style={gBtn}>Back</button>
          </div>
        )}

        {mode === 'signin' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[['Email', email, setEmail, 'you@example.com', 'email'], ['Password', password, setPassword, 'Your password', 'password']].map(([label, val, setter, ph, type]) => (
              <div key={label}>
                <div style={{ fontSize: 10, letterSpacing: 3, color: '#8B92A8', textTransform: 'uppercase', fontFamily: 'Helvetica, sans-serif', marginBottom: 6 }}>{label}</div>
                <input type={type} value={val} onChange={e => setter(e.target.value)} placeholder={ph} style={{ width: '100%', padding: '13px 14px', background: '#1A2238', border: '1px solid #2A3450', borderRadius: 8, color: '#F5F1E8', fontFamily: 'Georgia, serif', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
              </div>
            ))}
            {error && <div style={{ background: 'rgba(200,80,80,0.1)', border: '1px solid rgba(200,80,80,0.3)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#E88A8A' }}>{error}</div>}
            {message && <p style={{ color: '#C9A961', fontSize: 13, textAlign: 'center' }}>{message}</p>}
            <button onClick={handleSignIn} disabled={loading} style={aBtn}>{loading ? 'Logging in...' : 'Log In'}</button>
            <button onClick={() => { setMode('forgot'); setError(''); }} style={gBtn}>Forgot password?</button>
            <button onClick={() => { setMode('welcome'); setError(''); }} style={gBtn}>Back</button>
          </div>
        )}

        {mode === 'forgot' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <div style={{ fontSize: 10, letterSpacing: 3, color: '#8B92A8', textTransform: 'uppercase', fontFamily: 'Helvetica, sans-serif', marginBottom: 6 }}>Email</div>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" style={{ width: '100%', padding: '13px 14px', background: '#1A2238', border: '1px solid #2A3450', borderRadius: 8, color: '#F5F1E8', fontFamily: 'Georgia, serif', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
            </div>
            {error && <div style={{ background: 'rgba(200,80,80,0.1)', border: '1px solid rgba(200,80,80,0.3)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#E88A8A' }}>{error}</div>}
            {message && <p style={{ color: '#C9A961', fontSize: 13, textAlign: 'center' }}>{message}</p>}
            <button onClick={handleForgotPassword} disabled={loading} style={aBtn}>{loading ? 'Sending...' : 'Send Reset Email'}</button>
            <button onClick={() => { setMode('signin'); setError(''); setMessage(''); }} style={gBtn}>Back to Login</button>
          </div>
        )}
      </div>
    </div>
  );
}