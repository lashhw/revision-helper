document.getElementById('compare').addEventListener('click', compareTexts);

function compareTexts() {
    const original = document.getElementById('original').value;
    const revised = document.getElementById('revised').value;
    
    const dmp = new diff_match_patch();
    const diffs = dmp.diff_main(original, revised);
    dmp.diff_cleanupSemantic(diffs);
    
    displayDiffs(diffs);
}

function displayDiffs(diffs) {
    console.log(diffs)

    const diffDisplay = document.getElementById('diff-display');
    diffDisplay.innerHTML = '';
    
    let currentSegment = null;
    
    for (let i = 0; i < diffs.length; i++) {
        const type = diffs[i][0];
        const text = diffs[i][1];
        
        if (type === 0) { // No change
            if (currentSegment) {
                diffDisplay.appendChild(currentSegment);
                currentSegment = null;
            }
            const unchanged = document.createElement('span');
            unchanged.textContent = text;
            diffDisplay.appendChild(unchanged);
        } else {
            if (!currentSegment) {
                currentSegment = createDiffSegment();
            }
            const span = document.createElement('span');
            span.textContent = text;
            span.className = type === -1 ? 'deletion' : 'insertion';
            currentSegment.querySelector('.diff-content').appendChild(span);
        }
    }
    
    if (currentSegment) {
        diffDisplay.appendChild(currentSegment);
    }
}

function createDiffSegment() {
    const segment = document.createElement('div');
    segment.className = 'diff-segment';
    
    const content = document.createElement('div');
    content.className = 'diff-content';
    
    const buttons = document.createElement('div');
    buttons.className = 'action-buttons';
    
    const acceptBtn = document.createElement('button');
    acceptBtn.textContent = 'Accept';
    acceptBtn.className = 'accept';
    acceptBtn.onclick = () => acceptChange(segment);
    
    const rejectBtn = document.createElement('button');
    rejectBtn.textContent = 'Reject';
    rejectBtn.className = 'reject';
    rejectBtn.onclick = () => rejectChange(segment);
    
    buttons.appendChild(acceptBtn);
    buttons.appendChild(rejectBtn);
    
    segment.appendChild(content);
    segment.appendChild(buttons);
    
    return segment;
}

function acceptChange(segment) {
    const original = document.getElementById('original');
    const deletions = segment.querySelectorAll('.deletion');
    const insertions = segment.querySelectorAll('.insertion');
    
    deletions.forEach(del => del.remove());
    insertions.forEach(ins => ins.classList.remove('insertion'));
    
    segment.querySelector('.action-buttons').remove();
    updateOriginalText();
}

function rejectChange(segment) {
    const deletions = segment.querySelectorAll('.deletion');
    const insertions = segment.querySelectorAll('.insertion');
    
    deletions.forEach(del => del.classList.remove('deletion'));
    insertions.forEach(ins => ins.remove());
    
    segment.querySelector('.action-buttons').remove();
    updateOriginalText();
}

function updateOriginalText() {
    const diffDisplay = document.getElementById('diff-display');
    const text = diffDisplay.textContent;
    document.getElementById('original').value = text;
}