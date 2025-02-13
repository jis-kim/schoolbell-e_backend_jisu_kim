# schoolbell-e_backend_jisu_kim

### 문제 1

1, 3, 5, 7, 9 숫자를 각각 한 번씩만 사용하여 만들 수 있는 두 개의 숫자 중 곱이 가장 큰 조합을 찾는 스크립트

#### 해결 방법
- 5개의 숫자 중 가장 큰 곱을 만드는 방법은 2자리 수와 3자리 수를 만들어 곱하는 것입니다. 이 중 가능한 모든 조합을 시도해서 곱이 가장 큰 조합을 찾습니다.
- 5개의 숫자 중 3개의 숫자를 선택하고 가장 큰 값부터 큰 자릿수에 넣어 수를 생성한 후 모든 조합을 비교하여 가장 큰 곱을 찾습니다.

### 문제 2

Island의 개수 찾는 스크립트, 데이터를 적절한 자료구조로 변환한다.

#### 해결 방법
- 주어진 데이터를 2차원 배열로 변환합니다
- 2차원 배열을 dfs로 탐색하며 섬의 개수를 찾습니다.

### 문제 3

MySQL 또는 PostgreSQL을 사용하여 여러 단계의 승인 및 반려가 가능한 결재 시스템 구축하는 시나리오
1. 필요한 테이블을 최소한으로 정의하라.
2. 특정 사용자가 처리해야 할 결재 건을 나열하는 query를 작성하라.

테이블 -> User, Approval, ApprovalStatus, ApprovalHistory

#### 테이블
- users: 사용자 정보
  - id, name, department, position
- documents: 결재 받아야 하는 문서 정보
  - id, title, content, creator_id, created_at, updated_at
- approval_lines: 결재 라인
  - id, document_id, approver_id, order, is_required, created_at
- approval_histories: 결재 이력
  - id, document_id, approver_id, comment, status, created_at
  -
##### users
- id: SERIAL, PRIMARY KEY
- name: VARCHAR(128)
- department: VARCHAR(128)
- position: VARCHAR(128)

##### documents
- id: SERIAL, PRIMARY KEY
- title: VARCHAR(255)
- content: TEXT
- creator_id: INTEGER, FOREIGN KEY(users.id)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP

##### approval_lines
- id: SERIAL, PRIMARY KEY
- document_id: INTEGER, FOREIGN KEY(documents.id)
- approver_id: INTEGER, FOREIGN KEY(users.id)
- sequence: SMALLINT
- created_at: TIMESTAMP
- UNIQUE(document_id, approver_id)
- UNIQUE(document_id, sequence)

##### approval_histories
- id: SERIAL, PRIMARY KEY
- document_id: INTEGER, FOREIGN KEY(documents.id)
- approver_id: INTEGER, FOREIGN KEY(users.id)
- comment: TEXT
- status: SMALLINT (0: approved, 1: rejected)
- created_at: TIMESTAMP

- document 의 현재 처리 상태는 approval_lines의 최신 기록에 따라 판단합니다.
  - 없으면 pending, status = 0 이면 approved, status = 1 이면 rejected

#### Query
- documents 테이블과 approval_lines 테이블을 JOIN하여 결재 라인에 포함된 문서를 조회합니다.
= LEFT JOIN을 사용하여 approval_histories 테이블에서 현재 사용자의 결재 이력과 이전 결재자의 결재 결과를 확인합니다.
- WHERE 절을 사용하여 다음과 같은 조건을 만족하는 문서를 필터링합니다.
    - 현재 사용자가 결재자인 문서 (al.approver_id = :approver_id)
    - 아직 결재하지 않은 문서 (my_approval.id IS NULL)
    - 첫 번째 결재자이거나 이전 결재자가 승인한 문서 (al.sequence = 1 OR prev_approval.status = 0)
- ORDER BY 절을 사용하여 문서 생성일시 기준으로 내림차순 정렬합니다.
