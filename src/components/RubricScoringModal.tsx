import React, { useState, useEffect } from 'react';
import { X, Check, SlidersHorizontal, Calculator, Sparkles } from 'lucide-react';
import { Rubric, Student, CriterionScore } from '../types';

interface RubricScoringModalProps {
  isOpen: boolean;
  onClose: () => void;
  rubric: Rubric;
  student: Student;
  initialCriterionScores?: Record<string, CriterionScore>;
  totalAssessmentPoints: number;
  onApplyScore: (
    computedScore: number,
    criterionScoresMap: Record<string, CriterionScore>,
    summaryFeedback: string
  ) => void;
}

export const RubricScoringModal: React.FC<RubricScoringModalProps> = ({
  isOpen,
  onClose,
  rubric,
  student,
  initialCriterionScores,
  totalAssessmentPoints,
  onApplyScore
}) => {
  const [selectedLevels, setSelectedLevels] = useState<Record<string, number>>({});
  const [criterionComments, setCriterionComments] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialCriterionScores) {
      const levelMap: Record<string, number> = {};
      const commentMap: Record<string, string> = {};
      (Object.entries(initialCriterionScores) as [string, CriterionScore][]).forEach(([critId, sc]) => {
        levelMap[critId] = sc.levelIndex;
        if (sc.comment) commentMap[critId] = sc.comment;
      });
      setSelectedLevels(levelMap);
      setCriterionComments(commentMap);
    } else {
      setSelectedLevels({});
      setCriterionComments({});
    }
  }, [initialCriterionScores, isOpen, rubric]);

  if (!isOpen) return null;

  let totalPointsEarned = 0;
  let maxPossibleRubricPoints = 0;

  const criterionBreakdown: {
    critId: string;
    pointsEarned: number;
    maxPoints: number;
    levelIndex: number;
    levelName: string;
  }[] = [];

  rubric.criteria.forEach(crit => {
    const levelIdx = selectedLevels[crit.id] ?? 0;
    const levelObj = crit.levels.find(l => l.levelIndex === levelIdx);
    const maxLevelObj = crit.levels.reduce((prev, curr) => (curr.points > prev.points ? curr : prev), crit.levels[0]);

    const points = levelObj ? levelObj.points : 0;
    const maxPts = maxLevelObj ? maxLevelObj.points : 20;

    totalPointsEarned += points;
    maxPossibleRubricPoints += maxPts;

    if (levelObj) {
      criterionBreakdown.push({
        critId: crit.id,
        pointsEarned: points,
        maxPoints: maxPts,
        levelIndex: levelIdx,
        levelName: levelObj.levelName
      });
    }
  });

  const rawPercentage = maxPossibleRubricPoints > 0 ? totalPointsEarned / maxPossibleRubricPoints : 0;
  const scaledAssessmentScore = Math.round(rawPercentage * totalAssessmentPoints * 10) / 10;

  const handleSelectLevel = (critId: string, levelIndex: number) => {
    setSelectedLevels(prev => ({ ...prev, [critId]: levelIndex }));
  };

  const handleCommentChange = (critId: string, comment: string) => {
    setCriterionComments(prev => ({ ...prev, [critId]: comment }));
  };

  const handleSave = () => {
    const resultScoresMap: Record<string, CriterionScore> = {};
    let feedbackParts: string[] = [];

    rubric.criteria.forEach(crit => {
      const levelIdx = selectedLevels[crit.id] ?? 0;
      const levelObj = crit.levels.find(l => l.levelIndex === levelIdx);
      const pts = levelObj ? levelObj.points : 0;
      const comment = criterionComments[crit.id] || '';

      resultScoresMap[crit.id] = {
        criterionId: crit.id,
        levelIndex: levelIdx,
        pointsEarned: pts,
        comment
      };

      if (levelObj) {
        feedbackParts.push(`${crit.title}: ${levelObj.levelName}`);
      }
    });

    const autoSummary = `Rubric Evaluation (${scaledAssessmentScore}/${totalAssessmentPoints} pts): ` + feedbackParts.join(' • ');

    onApplyScore(scaledAssessmentScore, resultScoresMap, autoSummary);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white border-2 border-stone-900 rounded-none w-full max-w-4xl max-h-[92vh] flex flex-col shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] my-auto overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-[#1C1917] text-stone-50 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src={student.avatarUrl}
              alt={`${student.firstName} ${student.lastName}`}
              className="w-10 h-10 rounded-full object-cover border border-purple-400"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-serif font-bold text-white">
                  Rubric Evaluation: {student.firstName} {student.lastName}
                </h3>
                <span className="text-xs px-2 py-0.5 bg-stone-800 text-purple-300 font-mono border border-stone-700">
                  {student.studentIdNumber}
                </span>
              </div>
              <p className="text-xs text-stone-400 font-serif italic">{rubric.title}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded text-stone-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scoring Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-stone-900">
          <div className="p-4 bg-[#FAF8F5] border border-stone-900 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <Calculator className="w-6 h-6 text-stone-900" />
              <div>
                <span className="text-xs font-bold text-stone-600 uppercase tracking-widest block">Calculated Assessment Score</span>
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-serif font-extrabold text-stone-900">
                    {scaledAssessmentScore} <span className="text-sm font-normal text-stone-600">/ {totalAssessmentPoints} pts</span>
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-800">
                    ({Math.round(rawPercentage * 100)}%)
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs text-stone-600 text-right max-w-xs hidden sm:block">
              Click descriptor tiles below to evaluate performance per criterion.
            </p>
          </div>

          {/* Criteria Rows */}
          <div className="space-y-6">
            {rubric.criteria.map((crit, cIdx) => {
              const currentSelectedIdx = selectedLevels[crit.id];

              return (
                <div key={crit.id} className="p-4 bg-white border border-stone-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-serif font-bold text-stone-900 flex items-center space-x-2">
                        <span className="w-5 h-5 bg-stone-900 text-stone-50 text-xs flex items-center justify-center font-mono font-bold">
                          {cIdx + 1}
                        </span>
                        <span>{crit.title}</span>
                      </h4>
                      <p className="text-xs text-stone-600 mt-0.5">{crit.description}</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-stone-900 bg-stone-200 px-2.5 py-1 border border-stone-400">
                      Weight: {crit.weight}%
                    </span>
                  </div>

                  {/* Level Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                    {crit.levels.map(level => {
                      const isSelected = currentSelectedIdx === level.levelIndex;

                      return (
                        <div
                          key={level.levelIndex}
                          onClick={() => handleSelectLevel(crit.id, level.levelIndex)}
                          className={`p-3 border text-left cursor-pointer transition-all flex flex-col justify-between space-y-2 relative ${
                            isSelected
                              ? 'bg-stone-900 text-stone-50 border-stone-900 shadow-[2px_2px_0px_0px_rgba(28,25,23,1)]'
                              : 'bg-[#FAF8F5] border-stone-300 hover:border-stone-800 text-stone-900'
                          }`}
                        >
                          {isSelected && (
                            <span className="absolute top-2 right-2 p-0.5 bg-amber-400 text-stone-900">
                              <Check className="w-3 h-3" />
                            </span>
                          )}

                          <div>
                            <div className="flex items-center justify-between pr-4">
                              <span className="text-xs font-serif font-bold">{level.levelName}</span>
                              <span className={`text-[11px] font-mono font-extrabold ${isSelected ? 'text-amber-300' : 'text-emerald-800'}`}>
                                {level.points} pts
                              </span>
                            </div>
                            <p className="text-[11px] opacity-80 mt-1 line-clamp-4 leading-relaxed">
                              {level.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Criterion specific note */}
                  <input
                    type="text"
                    placeholder={`Optional note for ${crit.title}...`}
                    value={criterionComments[crit.id] || ''}
                    onChange={e => handleCommentChange(crit.id, e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-stone-800 text-xs text-stone-900"
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#FAF8F5] border-t border-stone-300 flex items-center justify-between">
          <span className="text-xs font-mono text-stone-600">
            {Object.keys(selectedLevels).length} of {rubric.criteria.length} criteria evaluated
          </span>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-stone-200 text-stone-900 text-xs font-bold"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 bg-stone-900 text-stone-50 text-xs font-bold border border-stone-900 shadow-[2px_2px_0px_0px_rgba(28,25,23,1)]"
            >
              Apply Score ({scaledAssessmentScore} pts)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
