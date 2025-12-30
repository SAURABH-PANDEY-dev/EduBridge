package com.backend.backend.repository;

import com.backend.backend.entity.DownloadLog;
import com.backend.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DownloadLogRepository extends JpaRepository<DownloadLog, Long> {
    List<DownloadLog> findByUserOrderByDownloadDateDesc(User user);
}