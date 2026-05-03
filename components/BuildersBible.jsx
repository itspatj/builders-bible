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
      day: 21,
      track: "money",
      trackName: "Money & Stewardship",
      reading: "Genesis 41 (NIV)",
      hook: "A prisoner interprets a dream and ends up managing the economy of the most powerful nation on earth.",
      contextPreview: "Genesis 41 is one of the most dramatic resource management stories in all of scripture...",
      context: "Genesis 41 is one of the most dramatic resource management stories in all of scripture. Joseph has been in prison for years -- falsely accused, forgotten by the people he helped. Then Pharaoh has two dreams that disturb him deeply, and no one in Egypt can interpret them. The cupbearer finally remembers Joseph. Joseph is brought out of prison, cleaned up, and brought before Pharaoh. He interprets the dreams clearly -- seven years of abundance followed by seven years of severe famine. And then, without being asked, he proposes a comprehensive economic plan to prepare for what is coming. Pharaoh recognizes immediately that there is no one wiser or more capable. A prisoner becomes the second most powerful person in the world.",
      principlePreview: "The way you manage resources in obscurity is the qualification for managing them at scale...",
      principle: "The way you manage resources in obscurity is the qualification for managing them at scale. Joseph did not develop his wisdom and discernment in Pharaoh's palace. He developed it in Potiphar's house, in a prison cell, in years of faithful stewardship when no one significant was watching. By the time he stood before Pharaoh, the character required for the role was already fully formed. The opportunity did not create the person -- it revealed him.",
      deepDive: "Joseph's plan in Genesis 41 is worth studying on its own merits. During the seven years of abundance, he collects one-fifth of the harvest across all of Egypt and stores it in the cities. He accumulates grain like the sand of the sea -- so much that he stops keeping records because it is beyond measure. Then when the famine comes, Egypt not only survives -- it becomes the supplier for the surrounding nations. What Joseph built during the good years funded the survival of the region during the hard years. The principle embedded in this story is one of the most practical in all of scripture. Prepare during abundance. Do not consume everything the good seasons produce. Store what the lean seasons will require. Most financial failure happens not because of bad luck but because of poor preparation during the seasons when preparation was possible.",
      application: "Three things from Genesis 41. First, build the financial habits now that your future self will need. Joseph did not wait until the famine to start thinking about the famine. The decisions you make during your current season of income and growth will determine what resources are available to you in the seasons that are harder. Second, save a percentage of everything -- not what is left over, but a portion off the top before anything else happens to it. Joseph took one-fifth. Find your number and automate it. Third, think beyond your own household. Joseph's preparation blessed an entire region. The scale of what you steward determines the scale of who you can serve in hard times. Build accordingly.",
      question: "What does your current financial preparation say about how seriously you are taking the lean seasons that will eventually come? And what would it look like to build with the next generation's needs in mind, not just your own?",
      prayer: "God, give me Joseph's foresight. Help me prepare during abundance, steward well in obscurity, and build financial disciplines that will serve not just me but everyone connected to what I am building. Amen.",
    },
    {
      id: "thematic-money-2",
      day: 22,
      track: "money",
      trackName: "Money & Stewardship",
      reading: "Proverbs 6-7 (NIV)",
      hook: "Two chapters about the traps that destroy people financially and personally -- and how to see them coming.",
      contextPreview: "Proverbs 6 and 7 are written as a father speaking to a son -- urgently, directly, without softening...",
      context: "Proverbs 6 and 7 are written as a father speaking to a son -- urgently, directly, without softening the stakes. The father is not giving his son abstract principles. He is warning him about specific patterns that he has watched destroy people. Financial traps. Laziness. Destructive character traits. And the seduction of things that look appealing but lead somewhere terrible. The tone throughout is not lecturing -- it is the voice of someone who has seen what these things actually cost and desperately wants the person they love to avoid it.",
      principlePreview: "The traps that destroy people financially are almost never sudden -- they are the result of small decisions made gradually over time...",
      principle: "The traps that destroy people financially are almost never sudden -- they are the result of small decisions made gradually over time. Proverbs 6 opens with a warning about co-signing loans for others -- putting yourself on the hook financially for someone else's obligations. The instruction is stark. If you have done this, go immediately and work to get yourself free. Do not sleep. Do not rest until you have dealt with it. The urgency is not about the other person. It is about protecting your own freedom and capacity to build.",
      deepDive: "Chapter 6 then moves to the ant -- one of the most enduring images in Proverbs. The ant has no commander, no overseer, no ruler, yet it stores its provisions in summer and gathers its food at harvest. The ant does not need external accountability to do what needs to be done. It operates from internal discipline and an accurate understanding of what is coming. Then the chapter lists seven things God hates -- and most of them are character issues that destroy relationships and trust, which are the foundation of any financial or vocational life. Lying, scheming, stirring up conflict. These are not sins that operate in isolation. They corrupt everything around them. Chapter 7 then focuses on the seduction of shortcuts -- the thing that looks like a fast path but leads to destruction. The image is of someone who goes near the corner where they know the trap is, telling themselves they are just passing by.",
      application: "Three practical takeaways from Proverbs 6 and 7. First, review your financial obligations. Are there co-signing arrangements, shared liabilities, or financial entanglements that are putting your freedom at risk? Deal with them as urgently as chapter 6 suggests. Second, build the discipline of the ant. Do not wait for a financial accountability system, a coach, or a crisis to start managing your money well. Decide what the right behaviors are and do them without needing someone to make you. Third, stay away from the corner. You already know which financial temptations are most dangerous for you -- the shortcut that looks appealing, the deal that seems too good. Do not go near it. The first protection against a trap is distance.",
      question: "What financial obligation or entanglement do you need to address with the urgency Proverbs 6 describes? And what is the corner you keep walking near that you already know you should stay away from?",
      prayer: "God, give me the discipline of the ant -- the internal drive to prepare and store without needing a crisis to motivate me. Show me the financial traps I am walking near and give me the wisdom and courage to deal with the obligations that are limiting my freedom. Amen.",
    },
    {
      id: "thematic-money-3",
      day: 23,
      track: "money",
      trackName: "Money & Stewardship",
      reading: "Malachi 3-4 (NIV)",
      hook: "God makes one of the boldest financial challenges in all of scripture. He essentially says -- test me on this.",
      contextPreview: "Malachi is the last book of the Old Testament, written to a community that has grown cynical and half-hearted...",
      context: "Malachi is the last book of the Old Testament, written to a community that has grown cynical and half-hearted in their relationship with God. They are going through the motions of religious practice while holding back in every area that actually costs them something. God's response throughout the book is direct and almost confrontational. He names what they are doing. He names what it is costing them. And in chapter 3, He makes a specific challenge around the tithe -- one of the only places in scripture where God explicitly invites people to test Him.",
      principlePreview: "Generosity is not a financial strategy -- it is an act of trust that positions you to receive what control never could...",
      principle: "Generosity is not a financial strategy -- it is an act of trust that positions you to receive what control never could. Malachi 3:10 says bring the whole tithe into the storehouse and test me in this, says the Lord Almighty, and see if I will not throw open the floodgates of heaven and pour out so much blessing that there will not be room enough to store it. The challenge is not to give in order to get. It is to release control of a portion of what you have and see what God does with the rest. That is a fundamentally different relationship with money than the one most people operate from.",
      deepDive: "The context of Malachi 3 makes the challenge more striking. God accuses the people of robbing Him -- specifically in tithes and offerings. The people push back and ask how. God answers directly. You are under a curse -- your whole nation -- because you are robbing me. This is not a gentle suggestion. It is a diagnosis of why things are not working. Then comes the invitation to test Him. The language of throwing open the floodgates is not subtle. God is not describing a modest blessing. He is describing overflow. Chapter 4 then closes the entire Old Testament with a call to remember the law and a promise of restoration -- the sun of righteousness will rise with healing in its rays. The book that ends with a curse if the people continue their pattern also ends with an extraordinary promise if they return.",
      application: "Two things from Malachi 3 and 4. First, evaluate your giving honestly. Not against a standard of guilt, but against the standard Malachi sets -- whole tithe, not partial. Most people give what is comfortable rather than what is first. The difference between those two is significant. Second, take the invitation to test God seriously. This is one of the few places in scripture where God explicitly says to put Him to the test. If you have been holding back in your giving because you are not sure you can afford it, Malachi 3 says that is the exact circumstance the invitation was written for.",
      question: "Are you giving the whole tithe or a comfortable portion of it? And have you ever actually tested God in this area the way Malachi 3 invites you to?",
      prayer: "God, I want to trust You with my finances at the level Malachi 3 describes. Loosen my grip on what I am holding back. Help me give first, give fully, and trust You with what remains. I want to experience what You describe on the other side of that obedience. Amen.",
    },
    {
      id: "thematic-money-4",
      day: 24,
      track: "money",
      trackName: "Money & Stewardship",
      reading: "Matthew 25 (NIV)",
      hook: "Three parables in one chapter. All three are about what you do with what you have been given while you are waiting.",
      contextPreview: "Matthew 25 contains three of the most well-known parables Jesus ever told -- and all three are about the same underlying question...",
      context: "Matthew 25 contains three of the most well-known parables Jesus ever told -- the ten virgins, the talents, and the sheep and the goats. They are placed back to back deliberately, and they are all answering the same underlying question. While you are waiting for something that has not yet arrived, what are you doing with what you have been given? The chapter is not primarily about money. But the parable of the talents is one of the most direct statements in scripture about the expectation that resources entrusted to you are meant to be multiplied, not buried.",
      principlePreview: "God does not entrust resources to people who will protect them from risk -- He entrusts them to people who will put them to work...",
      principle: "God does not entrust resources to people who will protect them from risk -- He entrusts them to people who will put them to work. The servant who received one talent and buried it was not being prudent. He was being fearful. And the master's response is one of the most challenging things in the Gospels. You wicked and lazy servant. The sin was not losing the money. The sin was doing nothing with it. That is a standard that cuts against every instinct to play it safe with what you have been given.",
      deepDive: "The parable of the talents is worth reading carefully because the details matter. The master distributes the talents according to each person's ability -- not equally, but proportionally. The expectation is not the same for everyone. It is calibrated to capacity. The servants who received five and two talents both doubled what they were given. The master's response to both is identical -- well done, good and faithful servant. The reward is not money. The reward is more responsibility. You have been faithful with a few things; I will put you in charge of many things. Then the servant with one talent explains his inaction. He was afraid. He knew the master was a hard man. The master does not dispute the characterization. He says then you should have at least deposited my money with the bankers so it would earn interest. The minimum expectation is growth. Preservation is not stewardship.",
      application: "Three things from Matthew 25. First, identify what you have buried. Every person reading this has something -- a skill, a resource, a relationship, an idea, a sum of money -- that is sitting untouched because of fear or inertia. Name it. Second, start with what you have been given, not what you wish you had. The servant with five did not wait to have ten before he acted. He worked with five. Start where you are. Third, reframe how you think about multiplication. The goal of stewardship is not preservation -- it is growth. Whatever God has entrusted to you is meant to produce something. Ask honestly whether it is.",
      question: "What has God entrusted to you -- financially, creatively, relationally -- that you are currently burying instead of putting to work? And what is the fear underneath that inaction?",
      prayer: "God, I do not want to stand before You with buried talents. Show me what You have entrusted to me that I am protecting instead of deploying. Give me the courage to put it to work and trust You with the outcome. Amen.",
    },
    {
      id: "thematic-money-5",
      day: 25,
      track: "money",
      trackName: "Money & Stewardship",
      reading: "Luke 12 (NIV)",
      hook: "Jesus is interrupted mid-teaching by someone asking Him to settle an inheritance dispute. His answer reveals everything about how He sees money.",
      contextPreview: "Luke 12 is one of the most direct chapters in the Gospels about anxiety, greed, and the way wealth distorts priorities...",
      context: "Luke 12 is one of the most direct chapters in the Gospels about anxiety, greed, and the way wealth distorts what people think matters. Jesus is in the middle of teaching a crowd of thousands when someone interrupts to ask Him to arbitrate an inheritance dispute. Jesus refuses and then tells a parable that gets to the root of what the man is actually dealing with -- not a legal problem, but a heart problem. The chapter then moves through warnings about hypocrisy, anxiety, and the danger of building a life around accumulation rather than around what actually lasts.",
      principlePreview: "The rich fool in Luke 12 is not a villain -- he is just a successful person who forgot to ask the most important question...",
      principle: "The rich fool in Luke 12 is not a villain -- he is just a successful person who forgot to ask the most important question. His land produced abundantly. He made good decisions about storage and capacity. He planned for his future comfort. And then God said to him -- fool. This very night your life will be demanded from you. Then who will get what you have prepared for yourself? The indictment is not that he was successful. It is that he was rich toward himself and not rich toward God. He built a great life on the wrong foundation.",
      deepDive: "The parable of the rich fool is followed immediately by one of the most sustained teachings Jesus gives about anxiety. Do not worry about your life, what you will eat. Do not worry about your body, what you will wear. Consider the ravens -- they do not sow or reap, yet God feeds them. Consider the lilies -- they do not labor or spin, yet Solomon in all his glory was not dressed like one of these. The argument Jesus is making is not that planning and work are wrong. He is addressing the anxiety that drives frantic accumulation -- the belief that if you just get enough, you will finally be secure. Then He draws a direct line. Where your treasure is, there your heart will be also. Your financial decisions are a map of what you actually believe in.",
      application: "Two things from Luke 12. First, ask the question the rich fool never asked. What is the point of what I am building? Who does it serve beyond me? A business, a financial portfolio, or a career built entirely for personal comfort is vulnerable to the same indictment. Build something that matters beyond your own comfort and security. Second, use your financial decisions as a diagnostic tool. Jesus says where your treasure is, that is where your heart is. Look at where your money actually goes -- not where you intend it to go, but where it actually goes -- and you will see what you genuinely believe in.",
      question: "What are you building primarily for your own comfort and security that does not serve anyone beyond yourself? And what does where your money actually goes tell you about what you actually believe?",
      prayer: "God, protect me from building a great life on the wrong foundation. Help me be rich toward You -- generous, purposeful, and free from the anxiety that drives accumulation. Let what I build serve people beyond myself. Amen.",
    },
    {
      id: "thematic-money-6",
      day: 26,
      track: "money",
      trackName: "Money & Stewardship",
      reading: "Luke 16 (NIV)",
      hook: "Jesus tells a parable about a dishonest manager and commends his shrewdness. Then He says you cannot serve both God and money.",
      contextPreview: "Luke 16 is one of the most theologically dense chapters in the Gospels on the subject of money and stewardship...",
      context: "Luke 16 is one of the most theologically dense chapters in the Gospels on the subject of money and stewardship. It contains two extended teachings -- the parable of the shrewd manager and the story of the rich man and Lazarus -- and between them, some of the most direct statements Jesus makes about wealth. The Pharisees, who loved money, are listening and sneering. Jesus knows it. The chapter is doing multiple things at once -- teaching about financial wisdom, warning about the eternal consequences of how we use wealth, and exposing the self-deception of people who think they can love money and love God simultaneously.",
      principlePreview: "You cannot serve two masters -- not because God is demanding exclusivity, but because money will always try to become your god if you let it...",
      principle: "You cannot serve two masters -- not because God is demanding exclusivity, but because money will always try to become your god if you let it. Jesus uses the word serve in the same sense as slavery. Money is not neutral. It is always pulling toward lordship. The person who thinks they have a casual relationship with wealth -- who believes they are in control of it rather than subtly shaped by it -- is the person most at risk of the dynamic Jesus is describing.",
      deepDive: "The parable of the shrewd manager is genuinely strange, and that is the point. A manager who is about to be fired uses his remaining access to make deals that will earn him goodwill after he loses his position. Jesus does not commend the dishonesty. He commends the shrewdness -- the willingness to think strategically, plan ahead, and use resources creatively for future benefit. The observation that follows is sobering. The people of this world are more shrewd in dealing with their own kind than are the people of the light. Jesus is essentially saying that his followers should think as carefully and strategically about how they use wealth for eternal purposes as worldly people do about using it for worldly ones. Then the chapter closes with the story of the rich man and Lazarus -- a beggar who sat at his gate every day while he lived in luxury. The reversal after death is absolute. The chapter is asking what you are doing right now with the resources at your gate.",
      application: "Two things from Luke 16. First, think strategically about using your financial resources for purposes that outlast you. The shrewd manager thought ahead. Most people think about money only in terms of current needs and future security. Think about what your wealth could fund, serve, or build that will matter beyond your lifetime. Second, look at who is at your gate. The rich man's sin was not his wealth -- it was his indifference to the person suffering right outside his door. Who is in your immediate proximity that your current financial decisions are ignoring?",
      question: "Are you being as strategic and intentional about using your resources for eternal purposes as you are about building your business or career? And who is sitting at your gate that you have not been seeing?",
      prayer: "God, make me shrewd about the things that matter eternally, not just the things that matter now. Open my eyes to who is at my gate. And keep money in its proper place -- a tool in Your hands, not a master over mine. Amen.",
    },
    {
      id: "thematic-money-7",
      day: 27,
      track: "money",
      trackName: "Money & Stewardship",
      reading: "1 Timothy 6 (NIV)",
      hook: "Paul writes the most misquoted verse about money in the Bible -- and what he actually said is sharper than most people remember.",
      contextPreview: "Paul is writing to Timothy who is leading a church in a wealthy commercial city where false teachers were treating ministry as a path to financial gain...",
      context: "Paul is writing to Timothy, who is leading a church in Ephesus -- a wealthy commercial city full of merchants, traders, and people pursuing prosperity. False teachers had crept in who were treating godliness as a means to financial gain. They were using spiritual influence to extract material benefit. Paul addresses this directly and forcefully, and in doing so gives one of the most careful and complete treatments of wealth in the entire New Testament. He does not say money is evil. He says the love of money is the root of all kinds of evil. That distinction is important and it is almost always lost.",
      principlePreview: "The love of money is not about how much you have -- it is about what your heart does with it...",
      principle: "The love of money is not about how much you have -- it is about what your heart does with it. Paul makes this distinction carefully. He warns against the love of money, not money itself. He instructs the rich not to be arrogant or to put their hope in wealth, which is uncertain -- but he does not tell them to give everything away. He tells them to be generous, to be rich in good deeds, and to be willing to share. The issue is not the asset. It is the orientation of the heart toward it.",
      deepDive: "Chapter 6 opens with instructions about contentment that build toward the famous verse. Godliness with contentment is great gain. For we brought nothing into the world, and we can take nothing out of it. But if we have food and clothing, we will be content with that. This is not an argument for poverty. It is an argument for a baseline of contentment that is not dependent on accumulation. Then Paul describes the pattern of those who want to get rich -- they fall into temptation and a trap, into many foolish and harmful desires that plunge people into ruin and destruction. The drift is gradual. The destruction is not. Then the chapter shifts to instructions for the wealthy. Do not be arrogant. Do not hope in wealth. Be generous. Be willing to share. In this way you will lay up treasure for yourself as a firm foundation for the coming age.",
      application: "Three things from 1 Timothy 6. First, evaluate whether contentment is actually operative in your life. Not as a feeling you wait for, but as a practiced posture. Are you building from a foundation of enough, or from a foundation of never enough? Second, examine what your wealth is hoping in. Paul says not to put hope in wealth, which is uncertain. If your sense of security is primarily tied to your financial position, that hope is sitting on unstable ground. Third, build a concrete plan for generosity. Paul tells the rich to be generous and willing to share -- not as a vague aspiration, but as a practice. What does that look like specifically for you?",
      question: "Is contentment actually operating in your life right now, or are you living in a state of chronic not enough regardless of what you have? And what does your wealth currently hope in?",
      prayer: "God, grow genuine contentment in me -- not passivity, but peace. Keep me from the trap of wanting to get rich at the expense of what actually matters. Make me generous in the specific, practical, consistent way Paul describes. Amen.",
    },
    {
      id: "thematic-money-8",
      day: 28,
      track: "money",
      trackName: "Money & Stewardship",
      reading: "Proverbs 22-23 (NIV)",
      hook: "Two chapters that cover more financial ground than most books on personal finance -- and do it in plain language.",
      contextPreview: "Proverbs 22 and 23 are among the most practically dense chapters in all of scripture on the subject of money and financial character...",
      context: "Proverbs 22 and 23 are among the most practically dense chapters in all of scripture on the subject of money and financial character. They cover reputation, generosity, debt, the danger of wealth-seeking, the importance of the poor, and the seduction of a wealthy lifestyle that does not belong to you. Unlike the narrative books of the Bible, Proverbs does not tell stories -- it makes observations. Direct, compressed, and often uncomfortable. Reading it slowly is more valuable than reading it fast.",
      principlePreview: "A good name is more desirable than great riches -- but most people spend their energy building the riches and assume the name will follow...",
      principle: "A good name is more desirable than great riches -- but most people spend their energy building the riches and assume the name will follow. Proverbs 22:1 opens the chapter with one of the most counter-cultural statements possible in an achievement-driven culture. To be esteemed is better than silver or gold. That is not an argument against wealth. It is an argument about what is worth building first. Reputation built on integrity outlasts wealth built on performance. And reputation destroyed by character failure outlasts wealth too.",
      deepDive: "Chapter 22 covers a remarkable range. The rich and poor have this in common -- the Lord is the maker of them all. Verse 7 is one of the most practical financial observations in the entire Bible -- the rich rule over the poor, and the borrower is slave to the lender. That is not a suggestion to avoid debt. It is a description of what debt actually does to your freedom and your options. Then the chapter warns against exploiting the poor and moving ancient boundary stones -- financial ethics are not separate from spiritual life. Chapter 23 then shifts to a different kind of danger. Do not wear yourself out to get rich. Have the wisdom to show restraint. Cast but a glance at riches, and they are gone. The ambition to accumulate wealth is described as exhausting and ultimately futile when it becomes the primary driver of your decisions.",
      application: "Three things from Proverbs 22 and 23. First, take debt seriously as a freedom issue, not just a financial issue. Every debt obligation is a claim on your future decision-making. Build the discipline of understanding what your debt is actually costing you in terms of options and freedom, not just in terms of interest rate. Second, audit your reputation alongside your finances. Proverbs 22 puts a good name above great riches. Are you building both, or are you building one at the expense of the other? Third, notice when wealth-building becomes the primary driver. Chapter 23 warns against wearing yourself out for it. Ambition is not the problem. Ambition that hijacks everything else is.",
      question: "What is your current level of debt actually costing you in terms of freedom and future options? And is your reputation keeping pace with your financial growth, or falling behind it?",
      prayer: "God, help me build a name worth having alongside the resources worth having. Give me wisdom about debt as a freedom issue, not just a financial one. And protect me from the exhaustion of making wealth my primary pursuit. Amen.",
    },
    {
      id: "thematic-money-9",
      day: 29,
      track: "money",
      trackName: "Money & Stewardship",
      reading: "Ecclesiastes 5-6 (NIV)",
      hook: "The wisest and wealthiest man in history looks at everything he has accumulated and says it is vapor.",
      contextPreview: "Ecclesiastes is the most unusual book in the Bible -- it is the reflections of someone who has had everything and is honest about what it actually delivered...",
      context: "Ecclesiastes is the most unusual book in the Bible. It is the reflections of someone who has pursued wealth, pleasure, achievement, and wisdom to the absolute limits of what was available to him -- and then sat down and gave an honest account of what it produced. Chapters 5 and 6 focus specifically on wealth, and the observations are some of the most honest in scripture. Not because wealth is condemned, but because the illusions surrounding it are dismantled one by one. The person writing this is not a monk who rejected prosperity. He is someone who had more of it than anyone and is telling you what he found on the other side.",
      principlePreview: "Whoever loves money never has enough -- this is not a moral statement, it is an observation about how the appetite for wealth actually works...",
      principle: "Whoever loves money never has enough -- this is not a moral statement, it is an observation about how the appetite for wealth actually works. Ecclesiastes 5:10 is describing a mechanism, not issuing a condemnation. The more you have, the more you want. The more you earn, the more there is to spend. The person who believes that reaching the next financial milestone will finally produce the security and satisfaction they are looking for has not yet encountered the person who reached that milestone and discovered the same hunger waiting for them on the other side.",
      deepDive: "Chapter 5 of Ecclesiastes covers several distinct observations. The person who loves money will not be satisfied with money. As goods increase, so do those who consume them -- and what benefit are they to the owners except to feast their eyes on them? The laborer sleeps well whether they eat little or much, but the abundance of the rich keeps them awake. There is a cruel irony embedded in this. The person who worked hardest to accumulate often sleeps worst because of what they have accumulated. Then chapter 6 goes further. A person may have a hundred children and live many years, but if they cannot enjoy their prosperity, a stillborn child is better off. The point is not nihilistic. It is this -- the capacity to enjoy what you have is more valuable than the amount of what you have. And that capacity cannot be purchased.",
      application: "Two things from Ecclesiastes 5 and 6. First, examine your relationship with enough. Not your financial number, but the actual experience. Do you feel like you have enough right now? If not, ask honestly whether reaching the next level will change that feeling -- or whether the issue is internal rather than financial. Second, invest in your capacity to enjoy what you have. Time with people you love. Rest that actually restores you. Experiences that are not primarily about status or achievement. The ability to enjoy your life is not a reward for financial success -- it is something that has to be actively protected from the pursuit of financial success.",
      question: "Do you have the capacity to genuinely enjoy what you currently have -- or are you so focused on the next level that enjoyment is always deferred? And what would it take for enough to actually feel like enough?",
      prayer: "God, protect me from the appetite that is never satisfied. Give me the genuine ability to enjoy what I have right now, to find rest in Your provision, and to build without losing the capacity to actually live. Amen.",
    },
    {
      id: "thematic-money-10",
      day: 30,
      track: "money",
      trackName: "Money & Stewardship",
      reading: "2 Corinthians 9 (NIV)",
      hook: "Paul makes the most direct case in the New Testament for why generous giving is actually in your interest -- not financially, but spiritually.",
      contextPreview: "2 Corinthians 9 is Paul's most extended treatment of generosity and giving in any of his letters...",
      context: "2 Corinthians 9 is Paul's most extended treatment of generosity and giving in any of his letters. He is writing to a church that had made a commitment to contribute to a collection for believers in Jerusalem who were suffering. He is encouraging them to follow through -- not under pressure, not reluctantly, but as an expression of genuine generosity that comes from the heart. The theology he builds around giving in this chapter is some of the most careful and complete in all of scripture. Generosity is not a tax. It is not a transaction. It is a participation in something that produces effects far beyond what the money itself can accomplish.",
      principlePreview: "Whoever sows generously will also reap generously -- this is not a prosperity formula, it is a description of how the economy of God actually works...",
      principle: "Whoever sows generously will also reap generously -- this is not a prosperity formula, it is a description of how the economy of God actually works. Paul uses agricultural language deliberately. A farmer does not sow sparingly to minimize risk and then expect a full harvest. The quantity of what you release is connected to the quantity of what returns. But the reaping Paul is describing is not primarily financial. It is the multiplication of righteousness, the increase of thanksgiving to God, and the deepening of relationships through genuine generosity.",
      deepDive: "Chapter 9 contains one of the most important statements about the posture of giving in all of scripture. Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver. The word cheerful here comes from the Greek hilaros -- the same root as the English word hilarious. God loves a hilarious giver. Someone who gives with such freedom and joy that the act itself is an expression of who they are, not a compliance with what they feel they should do. Then Paul describes what God can do with generous giving -- He who supplies seed to the sower and bread for food will also supply and increase your store of seed and will enlarge the harvest of your righteousness. The supply does not come before the sowing. It comes in response to it.",
      application: "Two things from 2 Corinthians 9. First, evaluate the posture of your giving. Not the amount, but the experience of it. Is it reluctant, obligatory, calculated -- or is it genuinely free and joyful? If it is not yet hilarious giving, ask what is keeping it from being that. Usually the answer is a level of scarcity thinking that generosity itself is designed to dismantle. Second, decide before you give. Paul says each person should give what they have decided in their heart -- not what is left over, not what they feel pressured into, but what they decided. Build a giving plan that reflects a real decision, not a reaction.",
      question: "Is your giving reluctant and calculated, or is it the kind of free and joyful generosity Paul describes? And have you actually decided what you are going to give, or are you still reacting?",
      prayer: "God, make me a hilarious giver. Dismantle the scarcity thinking that makes generosity feel risky. Help me decide with intention, give with freedom, and trust that You who supplies seed to the sower will not let genuine generosity go unrewarded. Amen.",
    },
    {
      id: "thematic-pressure-1",
      day: 31,
      track: "pressure",
      trackName: "Faith Under Pressure",
      reading: "Genesis 22 (NIV)",
      hook: "God asks Abraham to give up the one thing he waited decades for. Abraham's response is one of the most studied moments in scripture.",
      contextPreview: "Genesis 22 is one of the most theologically rich and emotionally difficult chapters in the entire Bible...",
      context: "Genesis 22 is one of the most theologically rich and emotionally difficult chapters in the entire Bible. Abraham has waited twenty-five years for the son God promised him. Isaac is not just his child -- he is the living proof that God keeps His word. He is the entire future of everything God has said He would do through Abraham's family. And then God asks Abraham to take Isaac to a mountain and offer him as a burnt offering. The request is not ambiguous. It is not a metaphor. And Abraham gets up early the next morning and goes.",
      principlePreview: "The deepest test of faith is not whether you believe God can -- it is whether you trust Him when He asks for what you love most...",
      principle: "The deepest test of faith is not whether you believe God can -- it is whether you trust Him when He asks for what you love most. Abraham's willingness to go to the mountain is not explained in the text. We are not given his internal reasoning or his emotional process. We are given his actions. He gets up. He goes. He tells his servants that he and the boy will go worship and then come back. That last phrase -- we will come back -- is either the statement of a man who has not fully accepted what is being asked of him, or the statement of a man who trusts that God will provide a way he cannot yet see. The writer of Hebrews tells us it was the second.",
      deepDive: "The details of Genesis 22 are deliberate and painful. God calls Isaac your son, your only son, whom you love -- three escalating descriptions of what is being asked. On the way up the mountain, Isaac asks his father where the lamb for the burnt offering is. Abraham answers -- God himself will provide the lamb. He says this before he knows it is true. That is what faith under pressure actually looks like. Not the absence of not knowing, but the willingness to speak what you believe before you can see it. Then at the moment of the knife, God stops him. And Abraham looks up and sees a ram caught in a thicket. He names the place -- the Lord will provide. That name becomes a declaration that outlasts the event by thousands of years.",
      application: "Two things from Genesis 22. First, notice that Abraham kept moving. He did not sit with the request and wait until he understood it fully before acting. He got up early and went. Most of us delay obedience until we have enough clarity to feel comfortable. Abraham's faith was demonstrated in motion, not in certainty. Second, pay attention to what God is asking you to release right now. The test in Genesis 22 is not unique to Abraham. The specific form changes -- for some it is a business, a relationship, a reputation, a dream -- but the underlying question is the same. Is there anything you hold so tightly that God cannot touch it? That grip is exactly what this story is about.",
      question: "What is your Isaac right now -- the thing God would have to pry out of your hands? And are you moving in obedience before you have full clarity, or waiting for certainty before you take the first step?",
      prayer: "God, You are the God who provides. Help me trust You with the things I love most -- not because it is easy, but because You have proven that You can be trusted with what matters most to me. Give me the faith to move before I can see the ram in the thicket. Amen.",
    },
    {
      id: "thematic-pressure-2",
      day: 32,
      track: "pressure",
      trackName: "Faith Under Pressure",
      reading: "Job 1-2 (NIV)",
      hook: "Job loses everything in two chapters. What makes this story different from every other suffering story is what God says about Job before it starts.",
      contextPreview: "Job 1 and 2 open one of the most unusual books in the Bible -- a sustained examination of suffering, faith, and the limits of human understanding...",
      context: "Job 1 and 2 open one of the most unusual books in the Bible -- a sustained examination of suffering, faith, and the limits of human understanding. Before anything bad happens to Job, God describes him. There is no one on earth like him -- blameless, upright, a man who fears God and shuns evil. Job is not suffering because of sin or failure or bad decisions. He is suffering because he is exactly who God says he is. That reframes everything. This is not a story about consequences. It is a story about faith that is tested precisely because it is genuine.",
      principlePreview: "Not all suffering is the result of failure -- sometimes the hardest seasons come to the most faithful people...",
      principle: "Not all suffering is the result of failure -- sometimes the hardest seasons come to the most faithful people because their faith is worth testing. The adversary's challenge to God in chapter 1 is pointed. Does Job fear God for nothing? Take away everything he has and he will curse you to your face. The implication is that Job's faith is transactional -- that he follows God because God has been good to him, and that genuine faith is not actually possible. The entire book of Job is God's answer to that challenge. And the answer is Job himself.",
      deepDive: "In two chapters, Job loses his livestock, his servants, and all ten of his children in rapid succession. Then in chapter 2, he loses his health. His wife tells him to curse God and die. His response is one of the most profound statements in scripture. Shall we accept good from God and not trouble? The word accept is doing heavy work here. Job is not pretending the pain is not real. He is choosing a posture toward it. Then three friends arrive -- and the text says that for seven days and seven nights they sat with him on the ground and no one said a word to him, because they saw how great his suffering was. That silence, before they open their mouths and say the wrong things, is the most helpful thing anyone does for Job in the entire book.",
      application: "Three things from Job 1 and 2. First, resist the impulse to explain suffering -- yours or someone else's. Job's friends sit in silence for seven days and that is when they are most useful. The moment they start offering theological explanations, they become a problem. When someone you know is in a Job season, the most powerful thing you can offer is often your presence, not your perspective. Second, take Job's posture seriously. Shall we accept good from God and not trouble? That is not resignation -- it is a theology of sovereignty applied to real pain. You do not have to understand a season to trust the One who is present in it. Third, remember that not all hard seasons are a result of your failure. Sometimes they are a result of your faithfulness.",
      question: "Is there a hard season you are currently in that you have been trying to explain or fix rather than simply endure with faith? And who in your life needs your silent presence more than your theological perspective right now?",
      prayer: "God, I do not always understand why hard things happen. But I want Job's posture -- the willingness to accept both good and trouble from Your hand without cursing You in either. Be present in this season even when I cannot see You clearly. Amen.",
    },
    {
      id: "thematic-pressure-3",
      day: 33,
      track: "pressure",
      trackName: "Faith Under Pressure",
      reading: "Psalm 46-47 (NIV)",
      hook: "Two psalms written in the middle of real threat and chaos. One says be still. The other says shout.",
      contextPreview: "Psalm 46 and 47 are placed together and they make a powerful combination...",
      context: "Psalm 46 and 47 are placed together and they make a powerful combination. Psalm 46 is a psalm of refuge written in the middle of what sounds like genuine catastrophe -- mountains falling into the sea, nations in uproar, kingdoms falling. It is not written from a place of safety looking back at danger. It is written from inside the storm. Psalm 47 then follows with a burst of praise and declaration about God's reign over the nations. Together they form a complete emotional arc -- from taking refuge to breaking into worship -- that models what faith under pressure is supposed to look like.",
      principlePreview: "Be still and know that I am God -- this is not a suggestion for a quiet morning. It is a command given in the middle of chaos...",
      principle: "Be still and know that I am God -- this is not a suggestion for a quiet morning. It is a command given in the middle of chaos. The stillness Psalm 46 calls for is not the absence of difficulty. The mountains are still falling into the sea when God says be still. It is a stillness of orientation -- a decision to anchor your attention on who God is rather than on how bad things look. That is one of the hardest things a human being can do under real pressure.",
      deepDive: "Psalm 46 opens with a declaration that is worth memorizing. God is our refuge and strength, an ever-present help in trouble. Then it describes the trouble in vivid terms -- the earth giving way, the mountains falling, the waters roaring and foaming. These are not metaphors for mild inconvenience. They are images of total disruption. And into that disruption, the psalm places a river whose streams make glad the city of God. In the middle of everything falling apart, there is a stream of gladness available to those whose city is in God. Then verse 10 -- be still, and know that I am God. The Hebrew word for be still carries the sense of letting go, releasing, ceasing from striving. It is not passive. It is an active surrender of control. Psalm 47 then follows immediately with clapping hands and shouting to God with cries of joy. The movement from stillness to praise is the full arc of what faith does with pressure.",
      application: "Two things from Psalms 46 and 47. First, practice the stillness of verse 10 as a discipline, not just a feeling. When pressure is highest, the instinct is to move faster and think harder. Psalm 46 says that is exactly when you need to stop and anchor yourself in who God is. Build a practice of stillness that you can access when things get hard -- not just when they are easy. Second, let praise follow stillness. Psalm 47 does not come before Psalm 46. The shout of joy comes after the decision to be still. Praise in the middle of pressure is not denial -- it is the declaration that you know something about the end of the story that your circumstances cannot take from you.",
      question: "What would it actually look like for you to be still in the middle of your current pressure -- not to stop working, but to stop striving? And what would you praise God for right now if you chose to?",
      prayer: "God, You are my refuge and strength. When the mountains fall into the sea of my circumstances, help me be still enough to know that You are God. Let stillness lead to praise, and let praise be my declaration that I know who holds the end of this story. Amen.",
    },
    {
      id: "thematic-pressure-4",
      day: 34,
      track: "pressure",
      trackName: "Faith Under Pressure",
      reading: "Daniel 3 (NIV)",
      hook: "Three men face a furnace heated seven times hotter than normal. Their answer to the king is one of the most powerful sentences in scripture.",
      contextPreview: "Daniel 3 takes place in the court of Nebuchadnezzar, the most powerful ruler of his era...",
      context: "Daniel 3 takes place in the court of Nebuchadnezzar, the most powerful ruler of his era. He has built a massive golden statue and commanded everyone in his empire to bow when the music plays. The penalty for refusal is death in a furnace heated to such extremes that the soldiers who throw the three men in are killed by the heat. Shadrach, Meshach, and Abednego are brought before the king to be given one more chance. The king gives them exactly the opportunity to take the easy way out. And their answer redefines what faith under pressure means.",
      principlePreview: "Their answer separates two things that most people keep connected -- God's ability and God's choice...",
      principle: "Their answer separates two things that most people keep connected -- God's ability and God's choice. They say the God we serve is able to deliver us from it. But even if He does not, we want you to know, Your Majesty, that we will not serve your gods or worship the image of gold. They are not saying God will definitely save them. They are saying that whether He does or not, their answer is the same. That is a category of faith that most people never arrive at because they are still negotiating with God about outcomes.",
      deepDive: "The details of Daniel 3 reward close reading. The furnace is heated seven times hotter than usual -- an act of rage that ends up being the detail that makes the miracle undeniable. When the three are thrown in, a fourth figure appears walking with them in the flames. Nebuchadnezzar describes him as looking like a son of the gods. The three come out of the furnace and the text notes that the fire had not harmed their bodies, nor was a hair of their heads singed. Their robes were not scorched and there was no smell of fire on them. The miracle is not just that they survived. It is that the fire left no trace. And the witness of this moment reshapes the most powerful empire on earth. Nebuchadnezzar does not become a follower of God, but he issues a decree acknowledging the God who delivered them. The furnace they were not delivered from becomes the testimony that changes the room.",
      application: "Two things from Daniel 3. First, settle the even if in advance. The pressure of a real crisis is not the best time to work out your theology of suffering. Decide before the furnace comes whether your faith is contingent on God giving you the outcome you want. If it is, that is worth addressing now. Second, remember that sometimes the rescue is in the fire, not from it. They were not delivered before the furnace. They were met inside it. Some of the most important things God wants to do in your life will happen in the middle of the difficulty, not on the other side of it. Do not be in such a hurry to get out that you miss who is walking with you in it.",
      question: "Is your faith contingent on God giving you the outcome you are hoping for -- or have you settled the even if? And what might God be doing in your current furnace that you would miss if you were delivered from it too quickly?",
      prayer: "God, I want the faith of Shadrach, Meshach, and Abednego -- the kind that does not negotiate with outcomes. Whether You deliver me from this or meet me in it, my answer is the same. I will not bow. Be with me in the fire. Amen.",
    },
    {
      id: "thematic-pressure-5",
      day: 35,
      track: "pressure",
      trackName: "Faith Under Pressure",
      reading: "Jonah 1-2 (NIV)",
      hook: "God tells Jonah to go east. Jonah books a ship going west. What happens next is one of the most honest stories about running from your calling.",
      contextPreview: "Jonah is one of the strangest and most human books in the entire Bible...",
      context: "Jonah is one of the strangest and most human books in the entire Bible. God gives Jonah a clear assignment -- go to Nineveh and preach against it. Nineveh was the capital of Assyria, the most brutal empire of its era, a place that had committed atrocities against Israel. Jonah does not want to go. But what he does next is not passive resistance -- he actively runs in the opposite direction. He boards a ship heading for Tarshish, which is as far west as you could go in the known world at the time. Jonah is not confused about what God asked. He is deliberately going the other way.",
      principlePreview: "You can run from your calling, but you cannot run from the One who gave it to you...",
      principle: "You can run from your calling, but you cannot run from the One who gave it to you. Jonah does not get away. The storm that overtakes the ship is not random weather -- it is a direct consequence of his flight. And when the sailors discover that Jonah is the cause of what is happening, he tells them to throw him overboard. It is a moment of strange honesty. He would rather drown than go to Nineveh. That is how deeply he does not want this assignment.",
      deepDive: "Chapter 1 contains one of the more uncomfortable details in the story. While the storm is raging and the sailors are terrified and throwing cargo overboard, Jonah has gone below deck and fallen into a deep sleep. The captain has to wake him. There is something deeply human about that detail -- the person running from God, asleep in the hold while everyone around him is in crisis. Then in chapter 2, after being swallowed by the great fish, Jonah prays. And the prayer is remarkable -- it is full of scripture, full of theological precision, and full of genuine desperation. Salvation comes from the Lord. The fish vomits Jonah onto dry land. The entire journey from the ship to the bottom of the sea to the shore is a rescue Jonah did not deserve. And then God speaks to Jonah a second time -- the same call, the same assignment. The calling does not change because you ran from it.",
      application: "Two things from Jonah 1 and 2. First, name honestly whether you are running from something God has clearly called you to. Jonah's story is extreme, but the pattern is recognizable. The assignment that feels too hard, too uncomfortable, too costly -- and the decision to go the other direction and hope God picks someone else. If you are in a storm right now, it is worth asking whether any of it is related to a direction you are deliberately not going. Second, notice that God pursues Jonah even in his running. The fish is not punishment -- it is a rescue. The bottom of the sea is where Jonah finally prays the prayer he should have prayed before he bought the ticket to Tarshish.",
      question: "Is there something God has clearly called you toward that you are currently running from -- booking the ship in the opposite direction? And what would it look like to stop running and pray the prayer Jonah prayed from the bottom of the sea?",
      prayer: "God, I do not want to need the fish to get my attention. Show me where I am running from what You have clearly asked of me. Give me the courage to go where You are sending me, even when the assignment feels impossible or uncomfortable. Salvation comes from You. Amen.",
    },
    {
      id: "thematic-pressure-6",
      day: 36,
      track: "pressure",
      trackName: "Faith Under Pressure",
      reading: "Matthew 14 (NIV)",
      hook: "Jesus feeds five thousand people, sends the disciples ahead, and then comes to them walking on water in the middle of a storm.",
      contextPreview: "Matthew 14 packs more into a single chapter than most books manage in their entirety...",
      context: "Matthew 14 packs more into a single chapter than most books manage in their entirety. It opens with the execution of John the Baptist -- a moment of genuine grief for Jesus. He tries to withdraw to a solitary place, but the crowds follow Him. He feeds five thousand people with five loaves and two fish. Then He dismisses the disciples in a boat while He goes up on a mountain alone to pray. A storm comes up. The disciples are straining at the oars. And then, in the fourth watch of the night -- between three and six in the morning, the darkest part -- Jesus comes to them walking on the water.",
      principlePreview: "Peter's moment of walking on water is not primarily a story about failure -- it is a story about being the only disciple who got out of the boat...",
      principle: "Peter's moment of walking on water is not primarily a story about failure -- it is a story about being the only disciple who got out of the boat. Twelve men saw Jesus walking on the water. One of them said Lord, if it is you, tell me to come to you on the water. One. And Jesus said come. And Peter got out and walked on water. He sank when he took his eyes off Jesus and focused on the wind. But he walked first. Most people remember the sinking. The walking is the more important part.",
      deepDive: "The timing of this story matters. The disciples have just watched Jesus feed thousands of people with almost nothing. They have seen miracle after miracle. And now, in a storm, in the dark, they see someone walking toward them on the water and they are terrified. They think it is a ghost. Their recent experience of Jesus's power has not automatically translated into faith in the next moment of pressure. That is a deeply honest observation about how faith actually works. It does not accumulate automatically. Each new pressure requires a fresh decision. When Peter begins to sink and cries out Lord, save me, Jesus reaches out immediately and catches him. Then He asks -- you of little faith, why did you doubt? The question is not a condemnation. It is an invitation to examine what shifted his attention from Jesus to the wind.",
      application: "Two things from Matthew 14. First, get out of the boat. Whatever the boat represents in your current situation -- the safe choice, the comfortable position, the risk-free option -- there is something Jesus is calling you toward that requires leaving it. The disciples who stayed in the boat were technically safer, but they also never walked on water. Second, when you start to sink, call out immediately. Peter's response when he began to sink was instant -- Lord, save me. He did not try to swim back to the boat on his own. He did not pretend he was fine. He called out and Jesus reached out immediately. The speed of the rescue is one of the most important details in the story.",
      question: "What is the boat you are currently unwilling to leave -- the safe option that is keeping you from stepping toward what Jesus is calling you to? And when you start to sink, do you call out immediately or do you try to manage it yourself first?",
      prayer: "God, give me the courage to get out of the boat. I know I will look at the wind sometimes. When I do, let my first response be Lord, save me -- and remind me that Your hand is already reaching out before the words are finished. Amen.",
    },
    {
      id: "thematic-pressure-7",
      day: 37,
      track: "pressure",
      trackName: "Faith Under Pressure",
      reading: "Romans 5 (NIV)",
      hook: "Paul says something that goes against every human instinct -- we rejoice in our sufferings. Then he explains exactly why.",
      contextPreview: "Romans 5 is one of the most carefully structured arguments in all of Paul's writing...",
      context: "Romans 5 is one of the most carefully structured arguments in all of Paul's writing. He has spent the first four chapters of Romans establishing that justification comes through faith, not works -- that the right standing before God that every person needs is available through Christ and cannot be earned. Chapter 5 then draws out the implications of that truth for how we live, especially how we live under pressure. The logic is tight and the conclusions are counterintuitive. We rejoice in our sufferings. Not despite them. Not after them. In them.",
      principlePreview: "Suffering produces perseverance, perseverance produces character, and character produces hope -- this is not a comfort, it is a description of a process...",
      principle: "Suffering produces perseverance, perseverance produces character, and character produces hope -- this is not a comfort, it is a description of a process. Paul is not saying that suffering is good. He is saying that suffering, when met with faith, produces something that cannot be produced any other way. The sequence is intentional. Perseverance does not come before suffering. Character does not come before perseverance. And the hope Paul describes at the end of the sequence is not optimism. It is a settled confidence that does not disappoint because it is rooted in God's love poured into our hearts through the Holy Spirit.",
      deepDive: "Romans 5 opens with therefore -- which means Paul is drawing a conclusion from everything he has just argued. Since we have been justified through faith, we have peace with God. And because of that peace, we have access to the grace in which we now stand. That standing is the foundation for everything that follows. The rejoicing in suffering is possible not because suffering is pleasant but because the person enduring it knows something about where it leads. Paul then makes the argument even more radical. While we were still sinners, Christ died for us. The love of God was demonstrated at the point of maximum human unworthiness. That is the love that has been poured into our hearts. A love that did not wait for us to be worthy is not going to abandon us in our suffering.",
      application: "Two things from Romans 5. First, change how you interpret your hard seasons. The process Paul describes -- suffering, perseverance, character, hope -- is not a formula you activate. It is a description of what happens when you walk through difficulty without abandoning faith. The question is not how to avoid the suffering. The question is what posture you bring to it. Second, anchor your hope in the right place. Paul says this hope does not put us to shame. The reason is not that everything works out the way we want. The reason is that it is grounded in a love that was proven at the cross before we had done anything to deserve it. That love does not fluctuate with your circumstances.",
      question: "What suffering are you currently in that you have not yet found a way to approach with the posture Paul describes? And what would change if you genuinely believed that God's love for you was not affected by how hard your season is?",
      prayer: "God, I want the hope that does not disappoint. Help me walk through the process Paul describes -- through suffering, through perseverance, through the formation of character -- without cutting it short. Pour Your love into my heart in this season so that I have something real to stand on. Amen.",
    },
    {
      id: "thematic-pressure-8",
      day: 38,
      track: "pressure",
      trackName: "Faith Under Pressure",
      reading: "2 Corinthians 11-12 (NIV)",
      hook: "Paul lists everything he has suffered and then asks God three times to remove his thorn. God says no.",
      contextPreview: "2 Corinthians 11 and 12 contain some of the most personally revealing writing Paul ever produced...",
      context: "2 Corinthians 11 and 12 contain some of the most personally revealing writing Paul ever produced. He is defending his apostleship against people who have been questioning his authority and comparing him unfavorably to more impressive-seeming leaders. His defense is unusual. Rather than listing his achievements and credentials, he lists his sufferings. Five times beaten with thirty-nine lashes. Three times shipwrecked. A night and a day in the open sea. In danger from rivers, bandits, his own people, and Gentiles. Sleepless nights, hunger and thirst, cold and exposure. This is the resume of a man who has been through things that would have broken most people long before.",
      principlePreview: "God's answer to Paul's prayer for relief was not yes -- it was my grace is sufficient for you...",
      principle: "God's answer to Paul's prayer for relief was not yes -- it was my grace is sufficient for you, for my power is made perfect in weakness. That is one of the hardest things God says to anyone in scripture. Not I will remove this. Not I will explain why this is here. My grace is enough. And Paul's response is equally remarkable. He says therefore I will boast all the more gladly about my weaknesses, so that Christ's power may rest on me. He does not just accept the answer. He leans into it.",
      deepDive: "The thorn in the flesh Paul describes in chapter 12 has been debated for centuries -- scholars have suggested everything from a physical ailment to a persistent enemy to a spiritual struggle. Paul does not tell us what it is. The ambiguity is probably intentional. The point is not the specific nature of the thorn. The point is what God says about it. It was given to keep Paul from becoming conceited. The suffering that Paul most wanted removed was serving a purpose he could not have achieved through comfort. Then the chapter closes with one of the most paradoxical statements in Paul's writing. When I am weak, then I am strong. The logic only makes sense if you believe that dependence on God produces something that self-sufficiency never can.",
      application: "Two things from 2 Corinthians 11 and 12. First, pray honestly about what you want removed. Paul asked three times. There is no shame in being persistent about something you genuinely want God to take away. The honesty of the asking is part of the relationship. Second, be open to the answer being no -- and to that no coming with a sufficiency you did not expect. The grace Paul received did not remove the thorn. It made him capable of carrying it in a way that produced something extraordinary. If God is not removing something you have asked Him to remove, the question worth sitting with is what He might be producing through it.",
      question: "What is the thorn you keep asking God to remove? And are you open to the possibility that His grace in the presence of it might produce something that its removal never could?",
      prayer: "God, I am bringing You the thing I most want removed. I am asking honestly and persistently. And I am also opening my hands to the possibility that Your answer might be my grace is sufficient. Let that be enough for me. Amen.",
    },
    {
      id: "thematic-pressure-9",
      day: 39,
      track: "pressure",
      trackName: "Faith Under Pressure",
      reading: "James 1-2 (NIV)",
      hook: "James opens his letter with something that goes against every instinct -- consider it pure joy when you face trials.",
      contextPreview: "James is writing to Jewish believers who have been scattered by persecution -- people who have lost homes, communities, and stability...",
      context: "James is writing to Jewish believers who have been scattered by persecution -- people who have lost homes, communities, and stability because of their faith. He does not open with comfort or condolence. He opens with a command that sounds almost unreasonable until you understand the theology underneath it. Consider it pure joy, my brothers and sisters, whenever you face trials of many kinds. Not when the trial is over. Not if you survive it. Whenever you face them. The joy is not in the trial itself. It is in what the trial is doing.",
      principlePreview: "The testing of your faith produces perseverance -- and perseverance, allowed to finish its work, produces maturity...",
      principle: "The testing of your faith produces perseverance -- and perseverance, allowed to finish its work, produces maturity and completeness that nothing else can produce. James uses the word complete in a way that implies there are things you simply cannot be without having gone through testing. Certain qualities of character, certain depths of trust, certain capacities for resilience cannot be downloaded or studied into existence. They can only be formed through the process James is describing. The trial is not an obstacle to your development. It is the mechanism of it.",
      deepDive: "Chapter 1 then moves quickly to a practical promise. If you lack wisdom -- specifically the wisdom to navigate trials -- ask God, who gives generously to all without finding fault. The wisdom available for hard seasons is accessible through asking. But then James adds a condition. Ask in faith, without doubting. The person who doubts is like a wave of the sea, blown and tossed by the wind. That person should not expect to receive anything from the Lord. The instability James is describing is not honest uncertainty -- it is a fundamental lack of conviction about who God is. Chapter 2 then turns the corner to faith and works. Faith without works is dead. This is not a contradiction of salvation by grace -- it is a description of what genuine faith looks like when it is alive. A faith that does not produce action is not the kind of faith James is talking about. Real faith, tested and proven, moves.",
      application: "Two things from James 1 and 2. First, ask for wisdom specifically in the trial you are in right now. James 1 says God gives it generously and without finding fault. Most people in trials ask for the trial to end. James says ask for wisdom to navigate it. Those are different prayers with different outcomes. Second, examine whether your faith is producing action. Chapter 2 is not asking whether you believe the right things. It is asking whether what you believe is changing what you do. A faith that has been tested and holds tends to produce movement. What is it producing in you?",
      question: "Have you asked God for wisdom in your current trial -- not for it to end, but for the wisdom to navigate it well? And what action should the faith you say you have be producing right now that it is not?",
      prayer: "God, I am asking You for wisdom in this specific trial. You said You give it generously and without finding fault. I am taking You at Your word. And help me have the kind of faith that moves -- not a faith that is only theoretical, but one that produces something real. Amen.",
    },
    {
      id: "thematic-pressure-10",
      day: 40,
      track: "pressure",
      trackName: "Faith Under Pressure",
      reading: "Philippians 4 (NIV)",
      hook: "Paul writes one of the most hopeful chapters in the New Testament from a prison cell while awaiting a verdict that could mean his execution.",
      contextPreview: "Philippians 4 is the closing chapter of a letter Paul writes while under Roman imprisonment...",
      context: "Philippians 4 is the closing chapter of a letter Paul writes while under Roman imprisonment -- likely in Rome, awaiting a hearing before Caesar that could result in his execution. The letter throughout is one of the most joyful pieces of writing in the entire New Testament. Not joyful because Paul's circumstances are good. Joyful because Paul has found something that his circumstances cannot touch. By the time he reaches chapter 4, he is drawing together the practical conclusions of everything he has been building toward in the letter.",
      principlePreview: "Contentment is not a personality trait -- it is a learned discipline that is available to anyone who pursues it...",
      principle: "Contentment is not a personality trait -- it is a learned discipline that is available to anyone who pursues it. Paul says explicitly -- I have learned to be content whatever the circumstances. He is not describing a natural disposition. He is describing something he acquired through a specific process. I know what it is to be in need, and I know what it is to have plenty. I have learned the secret of being content in any and every situation. The secret he has learned is not suppression of desire or indifference to circumstance. It is a source of strength that is independent of both.",
      deepDive: "Philippians 4 covers an extraordinary amount of ground in a short space. It opens with a personal appeal to two women in the church who are in conflict -- Paul names them by name and asks a third party to help them reconcile. Then it moves to the command to rejoice always, to let gentleness be evident to all, and to present every anxiety to God in prayer with thanksgiving. The peace that follows is described as transcending understanding -- it is not the peace of having solved the problem. It is the peace of having brought it to Someone who can. Then the famous verse 13 -- I can do all things through Christ who strengthens me -- which in context is not a declaration of unlimited human potential. It is a declaration that Paul can be content in any circumstance through the strength Christ provides. The all things refers to all circumstances, not all ambitions.",
      application: "Two things from Philippians 4. First, build the practice of presenting your anxieties to God specifically and immediately. Paul does not say suppress your anxiety or manage it -- he says present it to God in prayer with thanksgiving. That last phrase matters. Thanksgiving is an act of trust that what you are handing over is going somewhere safe. Build the habit of naming your specific anxieties and handing them to God by name. Second, pursue contentment as a discipline. If you are waiting to feel content, you will wait indefinitely. Paul says he learned it. That implies a curriculum. The curriculum is usually made up of exactly the circumstances you are trying to get out of.",
      question: "What specific anxiety do you need to present to God today -- not manage, not suppress, but actually hand over? And what would it look like to pursue contentment as a discipline rather than waiting for it as a feeling?",
      prayer: "God, I am presenting this specific anxiety to You today -- by name, with thanksgiving. I trust You with it. And grow in me the contentment that Paul describes -- the kind that is learned through the very circumstances I would not have chosen. I can do all things through Christ who strengthens me. Amen.",
    },
    {
      id: "thematic-wisdom-1",
      day: 41,
      track: "wisdom",
      trackName: "Wisdom & Decision Making",
      reading: "Proverbs 3-4 (NIV)",
      hook: "Two chapters that lay out the most complete framework for wisdom in the entire Bible -- and the price of getting it.",
      contextPreview: "Proverbs 3 and 4 are the heart of the book's opening argument about wisdom...",
      context: "Proverbs 3 and 4 are the heart of the book's opening argument about wisdom. A father is speaking directly to his son with a kind of urgency that makes clear he is not giving advice -- he is passing on something he considers essential for survival and flourishing. The tone throughout is personal and direct. This is not abstract philosophy. It is the distilled experience of someone who has watched wisdom and folly play out in real lives and is doing everything in his power to ensure the person he loves chooses correctly.",
      principlePreview: "Trust in the Lord with all your heart and lean not on your own understanding -- this is not passive, it is the most active thing a builder can do...",
      principle: "Trust in the Lord with all your heart and lean not on your own understanding -- this is not passive, it is the most active thing a builder can do. Proverbs 3:5-6 is one of the most quoted passages in scripture, but it is rarely understood in its full weight. Leaning on your own understanding is the default. It is what every intelligent, capable, experienced person does naturally. The instruction to lean away from it is a deliberate choice that has to be made repeatedly, not once. And in all your ways submit to Him -- the word submit here means acknowledge, recognize, make room for. In every area of your life, give God the space to direct your path.",
      deepDive: "Chapter 3 covers the full scope of what wisdom-oriented living looks like. Honor God with your wealth and your firstfruits. Do not despise the Lord's discipline, because He disciplines those He loves. Do not withhold good from those who deserve it when it is in your power to act. Do not envy the violent or choose any of their ways. Each of these is a practical instruction with a specific consequence attached. The chapter is not asking for abstract devotion -- it is asking for specific behavioral choices in specific areas. Chapter 4 then intensifies the appeal. Get wisdom, get understanding. Do not forsake wisdom and she will protect you. The first thing, above all else, is to get wisdom. Prize her and she will honor you.",
      application: "Three things from Proverbs 3 and 4. First, apply the trust framework to a specific decision you are currently facing. Not as a feeling, but as a practice. Before your strategy session, before your analysis, bring the decision to God and genuinely submit it -- meaning make room for Him to redirect what you think you already know. Second, audit whether you are withholding good from someone in your life when it is within your power to act. Chapter 3 is direct about this. Do not say come back tomorrow when you can help today. Third, invest in wisdom as your primary resource. Chapter 4 says prize her above everything else. What does it look like for you to invest in wisdom the way you invest in skills, networks, and capital?",
      question: "What decision are you currently processing with your own understanding that you have not yet genuinely submitted to God? And what would it look like to prize wisdom as your primary investment this year?",
      prayer: "God, I lean on my own understanding more than I realize. In every area where I am making decisions right now, I want to acknowledge You -- to make room for Your direction even when I think I already know the answer. Give me wisdom and help me prize it above everything else. Amen.",
    },
    {
      id: "thematic-wisdom-2",
      day: 42,
      track: "wisdom",
      trackName: "Wisdom & Decision Making",
      reading: "1 Kings 3-4 (NIV)",
      hook: "God offers a young king anything he wants. His answer sets the trajectory for one of the most remarkable reigns in history.",
      contextPreview: "1 Kings 3 and 4 tell the story of how Solomon begins his reign and what he asks for when God gives him an open invitation...",
      context: "1 Kings 3 and 4 tell the story of how Solomon begins his reign and what he does with the extraordinary gift he receives. Solomon has just inherited the throne from his father David. He is young, inexperienced, and under no illusions about the weight of what he has been given. He is leading a nation of people he describes as too numerous to count. God appears to him in a dream and gives him what amounts to a blank check -- ask for whatever you want me to give you. The answer Solomon gives reveals more about his character than almost anything else he ever does.",
      principlePreview: "Solomon did not ask for wisdom to make himself impressive -- he asked for it because he genuinely understood what the task required...",
      principle: "Solomon did not ask for wisdom to make himself impressive -- he asked for it because he genuinely understood what the task required. He describes himself as a little child who does not know how to carry out his duties. That is not false humility from someone who had just successfully navigated a complex political succession. It is the honest self-assessment of a person who understands that the gap between what he has been given and what he is capable of on his own is enormous. Wisdom begins with that kind of honesty about your own limits.",
      deepDive: "God's response to Solomon's request is one of the most generous moments in scripture. Because Solomon asked for wisdom rather than long life, wealth, or the death of his enemies, God gives him wisdom and then adds everything else on top. There has never been anyone like you before, and there will never be anyone like you again. Chapter 4 then demonstrates what that wisdom looks like in practice. Solomon's wisdom was as vast as the sand on the seashore. People came from all nations to hear him. He spoke three thousand proverbs and composed over a thousand songs. He described plant life and animals and birds and reptiles and fish. The wisdom God gave Solomon was not just judicial wisdom. It was comprehensive understanding -- a mind that could hold the breadth of creation and make sense of it. That is what happens when wisdom is treated as the primary ask.",
      application: "Three things from 1 Kings 3 and 4. First, make wisdom your primary ask in prayer. Not just for specific decisions, but as a sustained request. Solomon asked once and received a lifetime. James 1 says God gives wisdom generously to all who ask. Most people never make it their primary request because they are asking for outcomes instead. Second, embrace the self-awareness Solomon demonstrates. He knew what he did not know. That kind of honest assessment of your own limitations is not weakness -- it is the beginning of wisdom. Third, notice that wisdom produced everything else. Solomon did not have to choose between wisdom and wealth, wisdom and influence, wisdom and legacy. Wisdom produced all of it. That is the argument Proverbs has been making from the beginning.",
      question: "When is the last time you asked God specifically for wisdom rather than for a particular outcome? And what would it look like to approach your leadership and decision-making from Solomon's starting point -- I am a little child who does not know how to carry out these duties?",
      prayer: "God, I want Solomon's ask. Not the outcomes I am focused on right now, but the wisdom to lead, decide, and build in a way that reflects Your character. I do not know how to carry out what You have put in front of me. Give me a discerning heart. Amen.",
    },
    {
      id: "thematic-wisdom-3",
      day: 43,
      track: "wisdom",
      trackName: "Wisdom & Decision Making",
      reading: "Proverbs 11-12 (NIV)",
      hook: "Two chapters that describe in plain language the difference between the person who builds well and the person who builds toward collapse.",
      contextPreview: "Proverbs 11 and 12 are a sustained contrast between two ways of moving through the world...",
      context: "Proverbs 11 and 12 are a sustained contrast between two ways of moving through the world -- the way of wisdom and integrity, and the way of foolishness and deception. The observations are not softened. Proverbs does not flatter its reader or try to make wisdom sound easy. It simply describes, with remarkable precision, what the outcomes look like on each path. The person reading it has to decide which description sounds more like where they are headed.",
      principlePreview: "Where there is no guidance a nation falls, but in an abundance of counselors there is safety...",
      principle: "Where there is no guidance a nation falls, but in an abundance of counselors there is safety. Proverbs 11:14 is one of the most direct statements in scripture about the necessity of counsel. This is not a suggestion for leaders who are unsure of themselves. It is a structural observation about how good decisions get made. No individual, regardless of how capable or experienced, has access to the full picture that a diverse group of wise counselors can provide. The person who leads primarily from their own judgment, without genuine accountability and input, is building toward a fall.",
      deepDive: "Chapter 11 covers the consequences of dishonesty, arrogance, and greed with remarkable specificity. The person of crooked heart does not prosper. Pride goes before destruction. Whoever trusts in their riches will fall. And then it flips. The righteous are delivered. The blameless have a direct path. Whoever refreshes others will be refreshed. The observations are not promises of easy success -- they are descriptions of how character plays out over time in the texture of a life. Chapter 12 then adds depth. The way of a fool seems right to them, but the wise listen to advice. Fools show their annoyance at once, but the prudent overlook an insult. Anxiety weighs down the heart, but a kind word cheers it up. These are not abstract principles -- they are descriptions of what wise emotional and relational management actually looks like in daily life.",
      application: "Three things from Proverbs 11 and 12. First, evaluate the quality of your counsel. Do you have people in your life who will genuinely push back on your decisions -- not just affirm them? An abundance of counselors does not mean a large number of agreeable people. It means a diverse group of honest ones. Second, take the observations about honesty seriously as a business principle. Chapter 11 is consistent on this. Dishonest gain does not hold. A trustworthy person is a treasure. Build your reputation on accuracy and integrity in every transaction. Third, practice the emotional wisdom of chapter 12. The prudent overlook an insult. Anxiety weighs down the heart. These are not suggestions to suppress your feelings -- they are invitations to manage your responses with skill.",
      question: "Do you have an abundance of genuine counselors -- people who will tell you hard truths -- or do you have an abundance of agreeable people? And what decision are you currently making primarily from your own judgment that deserves more input?",
      prayer: "God, surround me with people who will tell me the truth. Protect me from the kind of pride that makes me resistant to correction. Give me the humility to listen to advice even when I think I already know the answer. Amen.",
    },
    {
      id: "thematic-wisdom-4",
      day: 44,
      track: "wisdom",
      trackName: "Wisdom & Decision Making",
      reading: "Ecclesiastes 3-4 (NIV)",
      hook: "The most famous poem about time ever written -- and what it actually means for how you make decisions.",
      contextPreview: "Ecclesiastes 3 opens with one of the most recognizable passages in all of literature -- there is a time for everything...",
      context: "Ecclesiastes 3 opens with one of the most recognizable passages in all of literature. A time to be born and a time to die. A time to plant and a time to uproot. A time to tear down and a time to build. Most people know these words as poetry. What they are actually doing is making a philosophical argument about the nature of time, human limitation, and the wisdom required to discern what kind of moment you are in. The person who always builds when they should be tearing down, or always speaks when they should be silent, is not making strategic errors -- they are making a wisdom error.",
      principlePreview: "The most important skill in decision making is not knowing what to do -- it is knowing what time it is...",
      principle: "The most important skill in decision making is not knowing what to do -- it is knowing what time it is. Ecclesiastes 3 is making the argument that every activity has its proper season, and that the person who can discern the season they are in will know how to act within it. Building in a time to tear down produces waste. Planting in a time to uproot produces loss. The wisdom question is not just what should I do -- it is what is this season for, and what does this moment require?",
      deepDive: "Chapter 3 asks a question that is worth sitting with for a long time. What do workers gain from their toil? He has made everything beautiful in its time. He has also set eternity in the human heart, yet no one can fathom what God has done from beginning to end. There is a deep tension in this observation. We are made with a sense of eternity -- an instinct that things should mean something, that our work should matter beyond the moment -- but we do not have the capacity to see the full picture of what God is doing. That is not a flaw in the design. It is a feature that produces the appropriate posture of humility and trust. Chapter 4 then turns to the relational dimension of wisdom. Two are better than one, because they have a good return for their labor. If either of them falls down, one can help the other up. A cord of three strands is not quickly broken. Wisdom does not just affect individual decisions -- it shapes the structures we build for support and accountability.",
      application: "Two things from Ecclesiastes 3 and 4. First, ask the season question before the strategy question. Before you decide what to do, ask what time it is. What is this season for in your life or business? Is it a time to build or a time to consolidate? A time to speak or a time to be silent? A time to plant or a time to wait for what was planted to grow? Second, invest in the cord of three strands. The relational wisdom of chapter 4 is not just a nice sentiment about friendship. It is a structural observation about resilience. Who are the two or three people whose presence in your life makes you more capable of getting back up when you fall?",
      question: "What season are you currently in -- and are your decisions aligned with what this season actually requires? And who are the people who make up your cord of three strands?",
      prayer: "God, give me the wisdom to know what time it is. Help me build when it is time to build, rest when it is time to rest, and speak when it is time to speak. And surround me with people who make me stronger, not just more comfortable. Amen.",
    },
    {
      id: "thematic-wisdom-5",
      day: 45,
      track: "wisdom",
      trackName: "Wisdom & Decision Making",
      reading: "Matthew 7 (NIV)",
      hook: "Jesus closes the Sermon on the Mount with a question that every builder has to answer: what are you building on?",
      contextPreview: "Matthew 7 is the conclusion of the Sermon on the Mount -- the longest sustained teaching Jesus gives in any of the Gospels...",
      context: "Matthew 7 is the conclusion of the Sermon on the Mount -- the longest sustained teaching Jesus gives in any of the Gospels. By the time He reaches the end of chapter 7, He has covered judgment, prayer, the narrow and wide roads, and false prophets. The chapter closes with a parable that is so clear and so demanding that it has been impossible to forget for two thousand years. Two builders. Two houses. One storm. The storm does not differentiate between them. What differentiates them is what they built on before the storm came.",
      principlePreview: "Everyone who hears these words of mine and puts them into practice is like a wise man who built his house on the rock...",
      principle: "Everyone who hears these words of mine and puts them into practice is like a wise man who built his house on the rock. The word that does the most work in this parable is practice. Both builders heard the words. The foolish builder is not someone who never encountered the truth. He heard it and did not put it into practice. The wisdom Jesus is describing is not informational -- it is applicational. The gap between knowing and doing is exactly where most people live, and it is exactly where foundations collapse.",
      deepDive: "Matthew 7 opens with the famous do not judge instruction, which is almost always misunderstood. Jesus is not saying never evaluate anything or anyone. He is saying do not apply a standard to others that you are unwilling to apply to yourself first. The log and speck illustration makes this vivid. Take care of your own vision before you try to correct someone else's. Then the chapter turns to prayer -- ask, seek, knock. The verbs are present tense and continuous -- keep asking, keep seeking, keep knocking. Then the golden rule -- do to others what you would have them do to you. This is not a social contract. It is a wisdom principle. The way you treat people shapes the kind of community you build and the kind of life you create. The parable of the two builders then closes everything. After all of this teaching -- after the commands and the wisdom and the warnings -- the question is simple. What are you building on?",
      application: "Two things from Matthew 7. First, identify the gap between what you know and what you practice. Most people who have been around scripture for any length of time have more knowledge than they have integrated. The wise builder is not the one who knows the most -- it is the one who has built on what they know. Take one thing from this path that you have understood but not yet put into practice and make it your focus for the next thirty days. Second, examine your foundation before the storm comes. The time to assess what your life and work are built on is not in the middle of a crisis. Do that work now, in the relative stability of the present, so that when the rain comes you already know what is underneath you.",
      question: "What is the gap between what you know to be true and what you are actually practicing? And if a storm hit your business, your relationships, and your faith all at once -- what would your foundation hold?",
      prayer: "God, I do not want to be the builder who heard everything and built on sand. Help me close the gap between what I know and what I do. Show me the foundation I am actually building on -- and where it needs to be stronger before the storm comes. Amen.",
    },
    {
      id: "thematic-wisdom-6",
      day: 46,
      track: "wisdom",
      trackName: "Wisdom & Decision Making",
      reading: "Luke 14-15 (NIV)",
      hook: "Jesus tells a parable about counting the cost before you build -- then tells three stories about things that were lost and found.",
      contextPreview: "Luke 14 and 15 sit together in a way that creates a powerful tension...",
      context: "Luke 14 and 15 sit together in a way that creates a powerful tension. Chapter 14 is about the cost and conditions of following Jesus -- demanding, sobering, requiring honest self-assessment before committing. Chapter 15 is about the lengths God goes to in order to find what is lost -- the lost sheep, the lost coin, the prodigal son. Together they make an argument about the nature of genuine wisdom. Real wisdom counts the cost honestly and then commits fully. And the God you are committing to is one who pursues relentlessly and celebrates extravagantly when what was lost comes home.",
      principlePreview: "Suppose one of you wants to build a tower. Will they not first sit down and estimate the cost to see if they have enough to complete it?...",
      principle: "Suppose one of you wants to build a tower. Will they not first sit down and estimate the cost to see if they have enough to complete it? Jesus is not making an argument against building. He is making an argument against building without counting the cost first. The person who starts without a clear-eyed assessment of what it will require -- and what it will cost -- is the person who ends up with a half-finished foundation that becomes a monument to poor planning. Wisdom in decision-making begins with honest assessment, not enthusiasm.",
      deepDive: "Luke 14 opens with Jesus at a dinner where He watches guests jockey for the best seats. His observation is sharp -- whoever exalts himself will be humbled, and whoever humbles himself will be exalted. Then He tells the host something radical about hospitality -- do not invite the people who can repay you. Invite those who cannot. The wisdom of the kingdom consistently inverts the logic of social exchange. Then the parable of the great banquet shows people making excuses for why they cannot come -- I just bought a field, I just bought oxen, I just got married. The things that keep people from responding to what God is doing in their lives are almost never bad things. They are ordinary things given too much weight. Chapter 15 then answers the cost of chapter 14 with the most famous parable Jesus ever told. The father runs to meet the returning son. He does not walk. He runs. That is the God you are counting the cost of following.",
      application: "Two things from Luke 14 and 15. First, apply the tower principle to every major decision. Before you commit -- to a business venture, a partnership, a hire, a strategy -- sit down and count the cost. Not to talk yourself out of it, but to enter it with clear eyes. The decisions that produce the most regret are usually the ones that were made on enthusiasm without honest assessment. Second, let chapter 15 reframe your understanding of who God is. The father in the prodigal son story does not wait for the son to clean himself up before running to him. He sees him from a distance and runs. Whatever you have walked away from, whatever you are carrying from past seasons of poor decisions -- that is the posture of the God you are learning to trust your decisions to.",
      question: "What major commitment are you currently considering that you have not yet honestly counted the cost of? And does your picture of God look more like the waiting father in Luke 15 or something smaller?",
      prayer: "God, give me the wisdom to count the cost before I commit and the courage to commit fully once I have. And keep the picture of the running father in front of me -- so I know who I am trusting with everything I build. Amen.",
    },
    {
      id: "thematic-wisdom-7",
      day: 47,
      track: "wisdom",
      trackName: "Wisdom & Decision Making",
      reading: "James 3-4 (NIV)",
      hook: "James describes two kinds of wisdom -- one that comes from above and one that produces chaos wherever it goes.",
      contextPreview: "James 3 and 4 are among the most practically demanding chapters in the New Testament...",
      context: "James 3 and 4 are among the most practically demanding chapters in the New Testament. Chapter 3 opens with a warning about teachers -- those who presume to teach others will be judged more strictly. Then it turns to the tongue, one of the most consistent themes in wisdom literature. A small rudder steers a massive ship. A small spark starts a massive fire. The tongue is small and its effects are enormous. Chapter 4 then gets to the root of where conflict and poor decisions come from -- the desires that battle within you. The fights and quarrels come from wanting something you do not have and not bringing that want to God.",
      principlePreview: "The wisdom that comes from heaven is first pure, then peace-loving, considerate, submissive, full of mercy, impartial, and sincere...",
      principle: "The wisdom that comes from heaven is first pure, then peace-loving, considerate, submissive, full of mercy, impartial, and sincere. James 3:17 is one of the clearest descriptions of what God-given wisdom actually looks like in practice. It is a list worth measuring your decision-making against. Not as a checklist for feeling good about your choices, but as a diagnostic. When the wisdom you are operating from produces bitterness, selfish ambition, disorder, and every evil practice -- that is the other kind. James calls it earthly, unspiritual, and demonic. The contrast is stark.",
      deepDive: "The imagery James uses for the tongue in chapter 3 is vivid and precise. We put bits in horses' mouths to make them obey us. A large ship is steered by a very small rudder. The tongue is a small part of the body but it makes great boasts. A great forest can be set on fire by a small spark. No human being can tame the tongue -- it is a restless evil full of deadly poison. With the tongue we praise God and curse people made in His image. That inconsistency is the heart of the problem. Then chapter 4 diagnoses the source of conflict with remarkable precision. You desire but you do not have. You covet but you cannot get what you want. You do not have because you do not ask God. You ask God and do not receive because you ask with wrong motives. The solution is not less wanting -- it is bringing your wanting to God rather than fighting for it in your own strength.",
      application: "Two things from James 3 and 4. First, audit your speech patterns as a wisdom indicator. What you say -- especially under pressure, especially about people who are not in the room -- is a reliable map of what is actually forming your decisions. The tongue reveals the heart. Second, bring your desires to God before you fight for them. Chapter 4 says the source of conflict is wanting something and going after it without bringing it to God first. What do you currently want badly enough that you are pursuing it in your own strength without asking whether God wants it for you?",
      question: "What does your speech -- especially under pressure and especially about people who are not present -- reveal about the kind of wisdom you are currently operating from? And what do you want right now that you have been fighting for without bringing to God?",
      prayer: "God, tame my tongue -- not by suppressing what I feel, but by forming what I actually believe. Give me the wisdom that comes from above -- pure, peaceable, full of mercy. And help me bring my desires to You before I fight for them. Amen.",
    },
    {
      id: "thematic-wisdom-8",
      day: 48,
      track: "wisdom",
      trackName: "Wisdom & Decision Making",
      reading: "Proverbs 15-16 (NIV)",
      hook: "Two chapters that get to the heart of how plans actually work -- and who is ultimately directing them.",
      contextPreview: "Proverbs 15 and 16 return to themes that run throughout the entire book -- the relationship between human planning and divine direction...",
      context: "Proverbs 15 and 16 return to themes that run throughout the entire book -- the relationship between human planning and divine direction, the difference between the counsel that produces life and the counsel that produces destruction, and the practical wisdom required to navigate relationships, speech, and decision-making well. By the time you reach these chapters, Proverbs has established enough context that these observations land with cumulative weight. You have seen the argument built over many chapters. Here it reaches some of its clearest conclusions.",
      principlePreview: "Commit to the Lord whatever you do, and he will establish your plans...",
      principle: "Commit to the Lord whatever you do, and he will establish your plans. Proverbs 16:3 is one of the most practical promises in the entire book -- and it is almost always misunderstood as passive. It is not. The word commit carries the sense of rolling your work onto God -- actively transferring the weight of it to Him. Not because you stop working, but because you stop carrying the outcome as though it depends entirely on you. The person who commits their work to God and the person who just works hard are doing different things even when their external actions look identical.",
      deepDive: "Proverbs 15 opens with one of the most practically useful observations in the book. A gentle answer turns away wrath, but a harsh word stirs up anger. The wisdom of how you respond in a difficult conversation is as consequential as the wisdom of the decision itself. Then the chapter turns to counsel. Plans fail for lack of counsel, but with many advisers they succeed. The repetition of this theme throughout Proverbs is not accidental. The book is insisting on something that proud people consistently resist -- you need other people's input to make good decisions. Chapter 16 then deepens this. In their hearts humans plan their course, but the Lord establishes their steps. Pride goes before destruction, a haughty spirit before a fall. Better a little with righteousness than much gain with injustice. How much better to get wisdom than gold, to get insight rather than silver.",
      application: "Three things from Proverbs 15 and 16. First, practice the gentle answer. The next time you are in a conversation that is escalating -- with a client, a team member, a partner -- pause before responding and ask what the gentle answer is. Chapter 15 says it turns away wrath. That is not weakness. It is skill. Second, commit your current projects and decisions to God actively and specifically. Not as a formality before you proceed however you intended, but as a genuine transfer of the weight of the outcome. Third, get counsel before you finalize major decisions. Proverbs 15 says plans fail without it. Not sometimes. Not usually. Plans fail without counsel.",
      question: "What major plan or project are you carrying as though its success depends entirely on you? And where do you most need counsel right now that you have been reluctant to ask for?",
      prayer: "God, I commit my work to You -- specifically and genuinely. Not as a formality, but as a real transfer of the outcome. Establish my plans according to Your purposes. And surround me with advisers who will tell me the truth. Amen.",
    },
    {
      id: "thematic-wisdom-9",
      day: 49,
      track: "wisdom",
      trackName: "Wisdom & Decision Making",
      reading: "Acts 15 (NIV)",
      hook: "The early church faces its first major doctrinal crisis. How they resolve it becomes the model for collective wisdom under pressure.",
      contextPreview: "Acts 15 is one of the most important chapters in the book of Acts -- not because of a miracle or a persecution, but because of a meeting...",
      context: "Acts 15 is one of the most important chapters in the book of Acts -- not because of a miracle or a persecution, but because of a meeting. The early church is growing rapidly across cultural lines, and a sharp disagreement has emerged about whether Gentile believers need to follow Jewish law. The dispute is not minor. It goes to the heart of how people understand salvation, identity, and what it means to belong to this new community. Paul and Barnabas have one position. A group of believers from Judea have another. The disagreement is sharp enough that they decide the matter needs to be brought to the apostles and elders in Jerusalem.",
      principlePreview: "The Jerusalem Council is a model of how genuine collective wisdom works -- it is not consensus for the sake of peace, it is honest deliberation in search of truth...",
      principle: "The Jerusalem Council is a model of how genuine collective wisdom works -- it is not consensus for the sake of peace, it is honest deliberation in search of truth. The apostles and elders come together to consider the question. There is much discussion. Multiple perspectives are heard. Then Peter speaks from personal experience. Then Paul and Barnabas report what they have witnessed. Then James draws on scripture to reach a conclusion. The decision that emerges is not a compromise. It is the result of a process that took seriously both experience and scripture, both the individual voices and the collective discernment.",
      deepDive: "Acts 15 is worth studying for its process as much as its conclusion. The church does not resolve the dispute through a single authoritative voice. It does not vote. It does not defer entirely to the most senior person in the room. It engages in genuine deliberation -- much discussion, the text says -- and allows multiple credible witnesses to speak before reaching a conclusion. Then the decision is not just announced. It is explained and sent in writing to the affected communities with the reasoning behind it. The letter says it seemed good to the Holy Spirit and to us. That phrase is remarkable. The council is claiming both divine guidance and human wisdom as the source of their conclusion -- not one or the other. And the conclusion is received by the communities it affects with joy and encouragement.",
      application: "Two things from Acts 15. First, build a decision-making process for your organization or life that resembles the Jerusalem Council more than a solo verdict. Important decisions deserve deliberation -- genuine input from multiple credible perspectives, honest engagement with disagreement, and a conclusion that can be explained and documented. Second, create the conditions for others to bring disagreements to you. The people in Acts 15 brought their dispute to the apostles and elders rather than letting it fester or fracture the community. That only works if the community trusts that the process will be fair and the decision will be explained. Are you someone people bring hard questions to?",
      question: "What important decision are you currently making primarily alone that would benefit from the kind of deliberate, multi-voice process Acts 15 models? And are you someone that people in your community trust to bring hard disagreements to?",
      prayer: "God, give me the humility to build processes that include other voices rather than defaulting to my own judgment. Help me create communities where hard questions can be brought and worked through honestly. And let my decisions reflect both human wisdom and Your guidance -- it seemed good to the Holy Spirit and to us. Amen.",
    },
    {
      id: "thematic-wisdom-10",
      day: 50,
      track: "wisdom",
      trackName: "Wisdom & Decision Making",
      reading: "Romans 12 (NIV)",
      hook: "Paul gives the most practical description of what a transformed mind actually looks like in everyday life.",
      contextPreview: "Romans 12 is where Paul's theology becomes practice...",
      context: "Romans 12 is where Paul's theology becomes practice. The first eleven chapters of Romans have built one of the most comprehensive theological arguments in scripture -- about sin, grace, justification, election, and the purposes of God. Chapter 12 opens with therefore -- everything that follows is an application of everything that came before. And the application begins with the mind. Do not conform to the pattern of this world, but be transformed by the renewing of your mind. Then you will be able to test and approve what God's will is -- his good, pleasing, and perfect will. The connection between a renewed mind and the ability to discern God's will is direct. You cannot have one without the other.",
      principlePreview: "Wisdom in decision-making begins with what is happening in your mind -- specifically whether it is being formed by the patterns of the world or transformed by God...",
      principle: "Wisdom in decision-making begins with what is happening in your mind -- specifically whether it is being formed by the patterns of the world or transformed by God. The word transformed in Romans 12:2 is metamorphoo in Greek -- the same root as metamorphosis. Paul is not describing a minor adjustment. He is describing a fundamental change in the structure of how you think. That kind of change does not happen passively or automatically. It is the result of what you consistently feed your mind, what community you are embedded in, and what you are allowing to shape your vision of what matters.",
      deepDive: "After the mind renewal instruction, Romans 12 moves into one of the most practical passages in Paul's writing about community and character. Do not think of yourself more highly than you ought. Each person has a different function in the body -- honor the differences. Love must be sincere. Hate what is evil. Cling to what is good. Be devoted to one another in love. Honor one another above yourselves. Be joyful in hope, patient in affliction, faithful in prayer. Share with the people who are in need. The list goes on for verse after verse. None of it is abstract. All of it is behavioral. Then the chapter closes with instructions about how to handle enemies -- do not repay evil for evil. Do not take revenge. If your enemy is hungry, feed him. Overcome evil with good. The wisdom to make good decisions is inseparable from the character to live well in community.",
      application: "Two things from Romans 12. First, take the renewing of your mind seriously as a daily practice. What you consistently consume -- news, social media, conversations, content -- is forming or deforming your capacity to discern God's will. This is not a call to disengage from the world. It is a call to be intentional about what is shaping your thinking. Second, let the character descriptions in the rest of the chapter serve as a mirror. Pick three from the list -- be devoted to one another, be joyful in hope, practice hospitality -- and ask honestly how well you are living them. The wisdom for good decision-making does not exist in isolation from the character of the person making the decisions.",
      question: "What is currently forming your mind more than God's word -- and is that producing the ability to discern His good, pleasing, and perfect will? And which of the character descriptions in Romans 12 is most lacking in your life right now?",
      prayer: "God, transform my mind. Not adjust it, not improve it -- transform it. Let the renewing happen through Your word, Your community, and Your Spirit working in me. And as my mind is renewed, let my decisions reflect something genuinely different from the patterns of the world around me. Amen.",
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

function generateBalancedSequence() {
  const paths = ["vision", "leadership", "money", "pressure", "wisdom"];
  const entriesByPath = {};
  paths.forEach((path) => {
    entriesByPath[path] = ENTRIES.thematic
      .filter((e) => e.track === path)
      .map((e) => e.id);
  });

  const sequence = [];
  const rounds = 10;

  for (let round = 0; round < rounds; round++) {
    const roundEntries = paths.map((path) => entriesByPath[path][round]);
    // shuffle the round
    for (let i = roundEntries.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [roundEntries[i], roundEntries[j]] = [roundEntries[j], roundEntries[i]];
    }
    sequence.push(...roundEntries);
  }

  return sequence;
}

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

// Check if streak should be reset
if (data.lastCompleted) {
  const today = new Date().toDateString();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toDateString();
  
  if (data.lastCompleted !== today && data.lastCompleted !== yesterdayStr) {
    data.streak = 0;
    if (sessionUser?.id) {
      await saveStreak(sessionUser.id, 0, data.lastCompleted);
    }
  }
}

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
      if (event === 'TOKEN_REFRESHED') {
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
      let readingSequence = next.readingSequence;
      if (next.onboarded && !readingSequence && next.readingPath === 'thematic') {
        readingSequence = generateBalancedSequence();
        next = { ...next, readingSequence };
        setState(next);
      }
      await saveProfile(user.id, user.email, {
        userType: next.userType,
        readingPath: next.readingPath,
        pace: next.pace,
        readingSequence,
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
<div style={{ fontSize: 12, color: COLORS.muted, fontFamily: "Helvetica, sans-serif", letterSpacing: 1, marginTop: 2 }}>
  {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
</div>
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
  
  let orderedEntries = allEntries;
  if (state.readingPath === 'thematic' && state.readingSequence) {
    orderedEntries = state.readingSequence
      .map((id) => allEntries.find((e) => e.id === id))
      .filter(Boolean);
  }
  
  const nextEntry = orderedEntries.find((e) => !completedSet.has(e.id));
  const upNextEntry = nextEntry ? orderedEntries[orderedEntries.indexOf(nextEntry) + 1] : null;
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
  const [showBreathing, setShowBreathing] = useState(true);
  const [noteText, setNoteText] = useState(state.notes[entry.id] || "");
  const [preStudyNote, setPreStudyNote] = useState(state.preStudyNotes?.[entry.id] || "");
  const [celebrating, setCelebrating] = useState(false);

  const unlock = async () => {
    const preStudyNotes = { ...(state.preStudyNotes || {}), [entry.id]: preStudyNote };
    const next = { ...state, unlockedDays: [...state.unlockedDays, entry.id], preStudyNotes };
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
      if (state.lastCompleted !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toDateString();
        if (state.lastCompleted === yesterdayStr) {
          newStreak = state.streak + 1;
        } else if (!state.lastCompleted) {
          newStreak = 1;
        } else {
          newStreak = 1;
        }
      }
      setCelebrating(true);
      setTimeout(() => setCelebrating(false), 3000);
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

  if (showBreathing) {
    return <BreathingTimer onComplete={() => setShowBreathing(false)} />;
  }
  return (
    <div style={{ minHeight: "100vh", background: COLORS.navyDeep, color: COLORS.cream, fontFamily: "Georgia, serif" }}>
     
     {celebrating && (
  <div style={{
    position: "fixed", inset: 0, zIndex: 200,
    display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
    background: "rgba(9, 19, 34, 0.92)",
    animation: "fadeIn 0.4s ease",
    pointerEvents: "none",
  }}>
    <div style={{
      fontSize: 72,
      animation: "bounceIn 0.6s ease",
      marginBottom: 16,
    }}>
      🙏
    </div>
    <div style={{
      fontSize: 22, fontWeight: 400,
      color: COLORS.cream,
      fontFamily: "Georgia, serif",
      marginBottom: 8,
      textAlign: "center",
    }}>
      Reading Complete
    </div>
    <div style={{
      fontSize: 14, color: COLORS.goldSoft,
      fontFamily: "Georgia, serif",
      fontStyle: "italic",
      textAlign: "center",
      maxWidth: 260,
    }}>
      Well done. Keep showing up.
    </div>
    {state.streak > 1 && (
      <div style={{
        marginTop: 16,
        padding: "8px 16px",
        background: COLORS.charcoalLight,
        border: "1px solid " + COLORS.gold,
        borderRadius: 999,
        fontSize: 13,
        color: COLORS.gold,
        fontFamily: "Helvetica, sans-serif",
        letterSpacing: 1,
      }}>
        🔥 {state.streak} day streak
      </div>
    )}
    <style>{`
      @keyframes bounceIn {
        0% { transform: scale(0); opacity: 0; }
        60% { transform: scale(1.2); opacity: 1; }
        100% { transform: scale(1); }
      }
    `}</style>
  </div>
)}

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
                        {/* Pre-study reflection */}
<div style={{ marginBottom: 20 }}>
  <div style={{ fontSize: 10, letterSpacing: 3, color: COLORS.goldSoft, textTransform: "uppercase", fontFamily: "Helvetica, sans-serif", marginBottom: 6 }}>
    What did you take from this passage?
  </div>
  <textarea
    value={preStudyNote}
    onChange={(e) => setPreStudyNote(e.target.value)}
    placeholder="Write your own thoughts before unlocking the study..."
    style={{
      width: "100%",
      minHeight: 120,
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
  Open your Bible. Read the passage. Write your thoughts. Then unlock the study.
</p>
          </div>
        ) : (
          /* Unlocked state */
          <div style={{ animation: "fadeIn 0.5s ease" }}>
            <div style={{
  background: "linear-gradient(135deg, " + COLORS.charcoal + ", " + COLORS.charcoalLight + ")",
  border: "1px solid " + COLORS.goldDim,
  borderRadius: 12,
  padding: "16px 18px",
  marginBottom: 12,
}}>
  <div style={{ fontSize: 10, letterSpacing: 3, color: COLORS.gold, textTransform: "uppercase", fontFamily: "Helvetica, sans-serif", marginBottom: 8 }}>
    Your Thoughts Before the Study
  </div>
  {state.preStudyNotes?.[entry.id] ? (
    <p style={{ margin: 0, fontSize: 14, lineHeight: 1.75, color: COLORS.cream, fontStyle: "italic" }}>
      {state.preStudyNotes[entry.id]}
    </p>
  ) : (
    <p style={{ margin: 0, fontSize: 13, lineHeight: 1.75, color: COLORS.muted, fontStyle: "italic" }}>
      You did not write anything before unlocking. Next time, take a moment to write your initial thoughts before tapping I've Read It.
    </p>
  )}
</div>
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
              {completed ? "✓ Reading Complete" : "Mark Reading Complete"}
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
function BreathingTimer({ onComplete }) {
  const [seconds, setSeconds] = useState(60);
  const [phase, setPhase] = useState("in");

  useEffect(() => {
    if (seconds <= 0) {
      onComplete();
      return;
    }
    const timer = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds]);

  useEffect(() => {
    const breathCycle = setInterval(() => {
      setPhase((p) => (p === "in" ? "out" : "in"));
    }, 4000);
    return () => clearInterval(breathCycle);
  }, []);

  const progress = ((60 - seconds) / 60) * 100;
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDash = (progress / 100) * circumference;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      background: COLORS.navyDeep,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "24px",
      animation: "fadeIn 0.8s ease",
    }}>
      {/* Top text */}
      <div style={{ textAlign: "center", marginBottom: 48, maxWidth: 320 }}>
        <div style={{ fontSize: 11, letterSpacing: 4, color: COLORS.gold, textTransform: "uppercase", fontFamily: "Helvetica, sans-serif", marginBottom: 12 }}>
          Before You Read
        </div>
        <p style={{ margin: 0, fontSize: 16, color: COLORS.cream, lineHeight: 1.7, fontFamily: "Georgia, serif", fontStyle: "italic" }}>
          Put away all distractions. Breathe. Center yourself. Ask God to open your heart to what you are about to read.
        </p>
      </div>

      {/* Breathing circle */}
      <div style={{ position: "relative", width: 220, height: 220, marginBottom: 40 }}>
        {/* Progress ring SVG */}
        <svg width="220" height="220" style={{ position: "absolute", inset: 0, transform: "rotate(-90deg)" }}>
          {/* Background ring */}
          <circle
            cx="110" cy="110" r={radius}
            fill="none"
            stroke={COLORS.border}
            strokeWidth="3"
          />
          {/* Progress ring */}
          <circle
            cx="110" cy="110" r={radius}
            fill="none"
            stroke={COLORS.gold}
            strokeWidth="3"
            strokeDasharray={`${strokeDash} ${circumference}`}
            strokeLinecap="round"
            style={{ transition: "stroke-dasharray 1s linear" }}
          />
        </svg>

        {/* Pulsing layers */}
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {/* Outer pulse layer */}
          <div style={{
            position: "absolute",
            width: phase === "in" ? 160 : 120,
            height: phase === "in" ? 160 : 120,
            borderRadius: "50%",
            background: "rgba(201, 169, 97, 0.08)",
            transition: "all 4s ease-in-out",
          }} />
          {/* Middle pulse layer */}
          <div style={{
            position: "absolute",
            width: phase === "in" ? 130 : 95,
            height: phase === "in" ? 130 : 95,
            borderRadius: "50%",
            background: "rgba(201, 169, 97, 0.12)",
            transition: "all 4s ease-in-out",
          }} />
          {/* Inner circle */}
          <div style={{
            position: "absolute",
            width: phase === "in" ? 100 : 75,
            height: phase === "in" ? 100 : 75,
            borderRadius: "50%",
            background: "linear-gradient(135deg, " + COLORS.goldDim + ", " + COLORS.gold + ")",
            transition: "all 4s ease-in-out",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{
              fontSize: 28, fontWeight: 700,
              color: COLORS.navyDeep,
              fontFamily: "Helvetica, sans-serif",
            }}>
              {seconds}
            </span>
          </div>
        </div>
      </div>

      {/* Breathe label */}
      <div style={{
        fontSize: 13, color: COLORS.goldSoft,
        fontFamily: "Georgia, serif", fontStyle: "italic",
        letterSpacing: 2, marginBottom: 40,
        transition: "opacity 1s",
      }}>
        {phase === "in" ? "breathe in..." : "breathe out..."}
      </div>

      {/* Skip */}
      <button
        onClick={onComplete}
        style={{
          background: "none", border: "1px solid " + COLORS.border,
          borderRadius: 999, padding: "8px 20px",
          color: COLORS.muted, fontFamily: "Helvetica, sans-serif",
          fontSize: 12, letterSpacing: 2, textTransform: "uppercase",
          cursor: "pointer",
        }}
      >
        Skip
      </button>

      <style>{"@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }"}</style>
    </div>
  );
}