-- Create Table

-- 사용자 테이블
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    department VARCHAR(128),
    position VARCHAR(128),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 결재 문서 테이블
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    creator_id INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
);

-- 결재 라인 테이블
CREATE TABLE approval_lines (
    id SERIAL PRIMARY KEY,
    document_id INTEGER NOT NULL REFERENCES documents(id),
    approver_id INTEGER NOT NULL REFERENCES users(id),
    sequence SMALLINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    UNIQUE(document_id, sequence)
    UNIQUE(document_id, approver_id)
);

-- 결재 이력 테이블
CREATE TABLE approval_histories (
    id SERIAL PRIMARY KEY,
    document_id INTEGER NOT NULL REFERENCES documents(id),
    approver_id INTEGER NOT NULL REFERENCES users(id),
    comment TEXT,
    status SMALLINT NOT NULL DEFAULT 0, -- 0: approved, 1: rejected
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- 특정 사용자가 처리해야 할 결재 건을 나열하는 query

SELECT d.*
FROM documents d
JOIN approval_lines al ON d.id = al.document_id
LEFT JOIN approval_histories my_approval ON d.id = my_approval.document_id
    AND my_approval.approver_id = :approver_id
LEFT JOIN approval_lines prev_line ON d.id = prev_line.document_id
    AND prev_line.sequence = al.sequence - 1
LEFT JOIN approval_histories prev_approval ON d.id = prev_approval.document_id
    AND prev_approval.approver_id = prev_line.approver_id
WHERE al.approver_id = :approver_id
AND my_approval.id IS NULL
AND (al.sequence = 1 OR prev_approval.status = 1)
ORDER BY d.created_at DESC;
