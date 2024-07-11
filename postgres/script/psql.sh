#! /bin/bash
# --------------------------------------------------------
# 파일명: psql.sh
# 설명: 이 스크립트는 실행된 Postgres 컨테이너의 데이터베이스와 상호작용하는 원격 psql 명령어를 실행하는 스크립트입니다.
# 작성자: @hubts
# 사용법: ./script/psql.sh [command]
# 주의: 이 스크립트는 lib.sh(라이브러리 스크립트)가 존재하는 경로에서 실행되어야 합니다.
# 주의2: [command]는 반드시 하나의 파라미터로 전달되어야 하므로, 실제 명령어와 같이 세미콜론 마무리 및 큰따옴표(")로 감싸주어야 합니다. 
# --------------------------------------------------------

# 환경설정 파일(.env)을 불러오는 함수
source lib.sh

usage()
{
    log.info "Usage: $0 [command]"
    log.info "[command] must be a single parameter as a command that contain a semicolon and double quotes."
    log.info "Example: $0 \"SHOW max_connections;\""
    exit 1
}

main()
{
    [[ -z "$1" ]] && usage

    docker exec -it $CONTAINER_NAME psql --username $POSTGRES_USER --dbname $POSTGRES_DB --command "$@"
}

main "$1"